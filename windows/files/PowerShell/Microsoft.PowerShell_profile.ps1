function ytmp3 {
    yt-dlp -x --audio-format mp3 --audio-quality 320k --embed-metadata --embed-thumbnail "ytsearch:$args"
}

function ytopus {
    yt-dlp -x --audio-format opus --embed-metadata --embed-thumbnail "ytsearch:$args"
}

function ytmp4 {
    yt-dlp --sponsorblock-mark poi_highlight --sponsorblock-remove sponsor --write-auto-subs --embed-thumbnail --embed-metadata -f mp4 "ytsearch:$args"
}

function ytmkv {
    yt-dlp --sponsorblock-mark poi_highlight --sponsorblock-remove sponsor --write-auto-subs --embed-thumbnail --embed-metadata -f mkv "ytsearch:$args"
}

# 'fs' needs a function because it combines two commands
function fs { Clear-Host; fastfetch }

# 'y' is a standard alias
Set-Alias y yazi
Set-Alias touch New-Item 
Set-Alias shutdown Stop-Computer -Force 
Set-Alias reboot Restart-Computer -Force
