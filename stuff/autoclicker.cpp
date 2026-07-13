#include <ApplicationServices/ApplicationServices.h>
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <string>
#include <map>
#include <algorithm>
#include <thread>
#include <atomic>
#include <chrono>
#include <random>
#include <csignal>
#include <unistd.h>

// ---- Global state -----------------------------------------------------

static std::atomic<bool> g_running{true};
static std::atomic<bool> g_clicking{false};

enum class BindKind { Mouse, Key };

struct BindTarget {
    BindKind kind;
    int code; // mouse: 0=left 1=right 2=middle 3=mb4 4=mb5 | key: macOS virtual keycode
};

struct TapConfig {
    BindTarget target;
    bool toggle_mode;
    CFMachPortRef tap = nullptr;
};

static void handle_sigint(int) {
    g_running = false;
    CFRunLoopStop(CFRunLoopGetCurrent());
}

// ---- Bind name -> code table -------------------------------------------
// macOS virtual keycodes are fixed physical-key positions (ANSI layout),
// hardcoded here so we don't need to link Carbon.h just for the constants.

const std::map<std::string, BindTarget>& bind_table() {
    static const std::map<std::string, BindTarget> table = {
        {"m1", {BindKind::Mouse, 0}}, {"m2", {BindKind::Mouse, 1}},
        {"m3", {BindKind::Mouse, 2}}, {"m4", {BindKind::Mouse, 3}},
        {"m5", {BindKind::Mouse, 4}},

        {"a", {BindKind::Key, 0x00}}, {"s", {BindKind::Key, 0x01}},
        {"d", {BindKind::Key, 0x02}}, {"f", {BindKind::Key, 0x03}},
        {"h", {BindKind::Key, 0x04}}, {"g", {BindKind::Key, 0x05}},
        {"z", {BindKind::Key, 0x06}}, {"x", {BindKind::Key, 0x07}},
        {"c", {BindKind::Key, 0x08}}, {"v", {BindKind::Key, 0x09}},
        {"b", {BindKind::Key, 0x0B}}, {"q", {BindKind::Key, 0x0C}},
        {"w", {BindKind::Key, 0x0D}}, {"e", {BindKind::Key, 0x0E}},
        {"r", {BindKind::Key, 0x0F}}, {"y", {BindKind::Key, 0x10}},
        {"t", {BindKind::Key, 0x11}}, {"o", {BindKind::Key, 0x1F}},
        {"u", {BindKind::Key, 0x20}}, {"i", {BindKind::Key, 0x22}},
        {"p", {BindKind::Key, 0x23}}, {"l", {BindKind::Key, 0x25}},
        {"j", {BindKind::Key, 0x26}}, {"k", {BindKind::Key, 0x28}},
        {"n", {BindKind::Key, 0x2D}}, {"m", {BindKind::Key, 0x2E}},

        {"1", {BindKind::Key, 0x12}}, {"2", {BindKind::Key, 0x13}},
        {"3", {BindKind::Key, 0x14}}, {"4", {BindKind::Key, 0x15}},
        {"5", {BindKind::Key, 0x17}}, {"6", {BindKind::Key, 0x16}},
        {"7", {BindKind::Key, 0x1A}}, {"8", {BindKind::Key, 0x1C}},
        {"9", {BindKind::Key, 0x19}}, {"0", {BindKind::Key, 0x1D}},

        {"space", {BindKind::Key, 0x31}}, {"tab", {BindKind::Key, 0x30}},
        {"capslock", {BindKind::Key, 0x39}}, {"escape", {BindKind::Key, 0x35}},
        {"return", {BindKind::Key, 0x24}},
        {"lctrl", {BindKind::Key, 0x3B}}, {"rctrl", {BindKind::Key, 0x3E}},
        {"lshift", {BindKind::Key, 0x38}}, {"rshift", {BindKind::Key, 0x3C}},
        {"lalt", {BindKind::Key, 0x3A}}, {"ralt", {BindKind::Key, 0x3D}},
        {"lcmd", {BindKind::Key, 0x37}}, {"rcmd", {BindKind::Key, 0x36}},
    };
    return table;
}

bool parse_bind(const std::string& raw, BindTarget& out) {
    std::string s = raw;
    std::transform(s.begin(), s.end(), s.begin(), ::tolower);
    auto& table = bind_table();
    auto it = table.find(s);
    if (it == table.end()) return false;
    out = it->second;
    return true;
}

// ---- Click injection ----------------------------------------------------

void send_click() {
    CGEventRef locEvent = CGEventCreate(nullptr);
    CGPoint loc = CGEventGetLocation(locEvent);
    CFRelease(locEvent);

    CGEventRef down = CGEventCreateMouseEvent(nullptr, kCGEventLeftMouseDown, loc, kCGMouseButtonLeft);
    CGEventPost(kCGHIDEventTap, down);
    CFRelease(down);

    usleep(15000); // 15ms hold, matches physical click duration

    CGEventRef up = CGEventCreateMouseEvent(nullptr, kCGEventLeftMouseUp, loc, kCGMouseButtonLeft);
    CGEventPost(kCGHIDEventTap, up);
    CFRelease(up);
}

// ---- Event tap callback --------------------------------------------------

static void handle_press(TapConfig* cfg, bool isDown, bool isRepeat = false) {
    if (cfg->toggle_mode) {
        if (isDown && !isRepeat) {
            g_clicking = !g_clicking;
            printf("\r[%s]                \n", g_clicking ? "CLICKING" : "STOPPED ");
            fflush(stdout);
        }
    } else {
        g_clicking = isDown; // held state mirrors physical press/release
    }
}

CGEventRef tap_callback(CGEventTapProxy, CGEventType type, CGEventRef event, void* refcon) {
    TapConfig* cfg = static_cast<TapConfig*>(refcon);

    if (type == kCGEventTapDisabledByTimeout || type == kCGEventTapDisabledByUserInput) {
        if (cfg->tap) CGEventTapEnable(cfg->tap, true);
        return event;
    }

    bool isMouseDown = (type == kCGEventLeftMouseDown || type == kCGEventRightMouseDown || type == kCGEventOtherMouseDown);
    bool isMouseUp   = (type == kCGEventLeftMouseUp   || type == kCGEventRightMouseUp   || type == kCGEventOtherMouseUp);
    bool isKeyDown   = (type == kCGEventKeyDown);
    bool isKeyUp     = (type == kCGEventKeyUp);

    if (cfg->target.kind == BindKind::Mouse && (isMouseDown || isMouseUp)) {
        int btn = (int)CGEventGetIntegerValueField(event, kCGMouseEventButtonNumber);
        if (btn == cfg->target.code) {
            handle_press(cfg, isMouseDown);
        }
    } else if (cfg->target.kind == BindKind::Key && (isKeyDown || isKeyUp)) {
        int code = (int)CGEventGetIntegerValueField(event, kCGKeyboardEventKeycode);
        if (code == cfg->target.code) {
            bool isRepeat = CGEventGetIntegerValueField(event, kCGKeyboardEventAutorepeat) != 0;
            handle_press(cfg, isKeyDown, isRepeat);
        }
    }

    return event; // never swallow events, this is a listen-only tap
}

// ---- CLI ------------------------------------------------------------------

void print_usage(const char* prog) {
    fprintf(stderr,
        "Usage: %s -b <bind> -r <min_cps> <max_cps> -t <true|false>\n\n"
        "  -b   Bind key/button. Mouse: m1 m2 m3 m4 m5\n"
        "       Keyboard: a-z, 0-9, space, tab, capslock, escape, return,\n"
        "                 lctrl, rctrl, lshift, rshift, lalt, ralt, lcmd, rcmd\n"
        "  -r   CPS range, e.g. -r 10 13\n"
        "  -t   true = press to toggle on/off\n"
        "       false = only click while bind is held down\n\n"
        "Example: %s -b m4 -r 10 13 -t false\n\n"
        "NOTE: macOS requires you to grant this terminal (or the compiled binary)\n"
        "both Accessibility and Input Monitoring permission under\n"
        "System Settings > Privacy & Security before it can see input events\n"
        "or inject clicks.\n",
        prog, prog);
}

int main(int argc, char** argv) {
    signal(SIGINT, handle_sigint);

    std::string bind_str;
    double min_cps = -1, max_cps = -1;
    bool toggle_mode = false;
    bool have_bind = false, have_rate = false, have_toggle = false;

    for (int i = 1; i < argc; ++i) {
        std::string arg = argv[i];
        if (arg == "-b" && i + 1 < argc) {
            bind_str = argv[++i];
            have_bind = true;
        } else if (arg == "-r" && i + 2 < argc) {
            min_cps = atof(argv[++i]);
            max_cps = atof(argv[++i]);
            have_rate = true;
        } else if (arg == "-t" && i + 1 < argc) {
            std::string t = argv[++i];
            std::transform(t.begin(), t.end(), t.begin(), ::tolower);
            toggle_mode = (t == "true" || t == "1" || t == "yes");
            have_toggle = true;
        } else if (arg == "-h" || arg == "--help") {
            print_usage(argv[0]);
            return 0;
        }
    }

    if (!have_bind || !have_rate || !have_toggle) {
        print_usage(argv[0]);
        return 1;
    }

    TapConfig cfg;
    cfg.toggle_mode = toggle_mode;
    if (!parse_bind(bind_str, cfg.target)) {
        fprintf(stderr, "Unknown bind '%s'. Run with -h to see supported binds.\n", bind_str.c_str());
        return 1;
    }
    if (min_cps <= 0 || max_cps <= 0 || min_cps > max_cps) {
        fprintf(stderr, "Invalid CPS range: %.2f %.2f (need 0 < min <= max)\n", min_cps, max_cps);
        return 1;
    }

    printf("=== C++ Auto Clicker (macOS) ===\n");
    printf("Bind: %s | CPS: %.2f-%.2f | Mode: %s\n\n",
           bind_str.c_str(), min_cps, max_cps, toggle_mode ? "toggle" : "hold");

    CGEventMask mask =
        CGEventMaskBit(kCGEventLeftMouseDown)  | CGEventMaskBit(kCGEventLeftMouseUp)  |
        CGEventMaskBit(kCGEventRightMouseDown) | CGEventMaskBit(kCGEventRightMouseUp) |
        CGEventMaskBit(kCGEventOtherMouseDown) | CGEventMaskBit(kCGEventOtherMouseUp) |
        CGEventMaskBit(kCGEventKeyDown)        | CGEventMaskBit(kCGEventKeyUp);

    CFMachPortRef tap = CGEventTapCreate(
        kCGHIDEventTap, kCGHeadInsertEventTap, kCGEventTapOptionListenOnly,
        mask, tap_callback, &cfg);

    if (!tap) {
        fprintf(stderr,
            "Failed to create event tap.\n"
            "Grant this terminal app (or the compiled binary) both:\n"
            "  System Settings > Privacy & Security > Accessibility\n"
            "  System Settings > Privacy & Security > Input Monitoring\n"
            "then try again.\n");
        return 1;
    }
    cfg.tap = tap;

    CFRunLoopSourceRef runLoopSource = CFMachPortCreateRunLoopSource(kCFAllocatorDefault, tap, 0);
    CFRunLoopAddSource(CFRunLoopGetCurrent(), runLoopSource, kCFRunLoopCommonModes);
    CGEventTapEnable(tap, true);

    printf(toggle_mode
        ? "Ready. Press your bind to toggle clicking on/off. Ctrl+C to quit.\n\n"
        : "Ready. Hold your bind to click. Ctrl+C to quit.\n\n");

    std::thread clicker([&]() {
        std::mt19937 rng(std::random_device{}());
        std::uniform_real_distribution<double> dist(min_cps, max_cps);
        while (g_running) {
            if (g_clicking) {
                double cps = dist(rng);
                double interval = 1.0 / cps;
                send_click();
                std::this_thread::sleep_for(std::chrono::duration<double>(interval));
            } else {
                std::this_thread::sleep_for(std::chrono::milliseconds(20));
            }
        }
    });

    CFRunLoopRun(); // blocks until CFRunLoopStop() is called (SIGINT handler)

    g_running = false;
    clicker.join();

    CGEventTapEnable(tap, false);
    CFRunLoopRemoveSource(CFRunLoopGetCurrent(), runLoopSource, kCFRunLoopCommonModes);
    CFRelease(runLoopSource);
    CFRelease(tap);

    printf("\nExiting.\n");
    return 0;
}
