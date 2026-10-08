"use strict";var Ni=Object.create;var wt=Object.defineProperty;var Oi=Object.getOwnPropertyDescriptor;var Vi=Object.getOwnPropertyNames;var qi=Object.getPrototypeOf,Wi=Object.prototype.hasOwnProperty;var Qi=(e,t)=>{for(var s in t)wt(e,s,{get:t[s],enumerable:!0})},ms=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Vi(t))!Wi.call(e,i)&&i!==s&&wt(e,i,{get:()=>t[i],enumerable:!(o=Oi(t,i))||o.enumerable});return e};var dt=(e,t,s)=>(s=e!=null?Ni(qi(e)):{},ms(t||!e||!e.__esModule?wt(s,"default",{value:e,enumerable:!0}):s,e)),zi=e=>ms(wt({},"__esModule",{value:!0}),e);var ko={};Qi(ko,{default:()=>Fi});module.exports=zi(ko);var X=require("@raycast/api"),Mi=require("@raycast/utils"),Ui=require("date-fns");var ps=require("@linear/sdk"),gs=require("@raycast/api"),fs=require("@raycast/utils"),mt=null;async function Bi(e,t,s,o,i){let c=JSON.stringify({query:s,variables:o}),a=new Headers(t.headers);new Headers(i).forEach((u,d)=>a.set(d,u)),a.set("Content-Type","application/json");let n=await fetch(e,{...t,method:"POST",headers:Object.fromEntries(a.entries()),body:c}),r=n.headers.get("Content-Type")?.startsWith("application/json")?await n.json():await n.text();if(typeof r!="string"&&n.ok&&!r.errors&&r.data)return{...r,headers:n.headers,status:n.status};throw new Error(typeof r=="string"?r:r.errors?.[0]?.message??`GraphQL Error (${n.status})`)}var qt=fs.OAuthService.linear({scope:"read write",onAuthorize({token:e}){mt=new ps.LinearClient({accessToken:e,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":gs.environment.extensionName}});let t=mt.client;t.rawRequest=((s,o,i)=>Bi(t.url,t.options,s,o,i))}});function h(){if(!mt)throw new Error("No linear client initialized");return{linearClient:mt,graphQLClient:mt.client}}async function Is(){let{graphQLClient:e}=h(),{data:t}=await e.rawRequest(`
      query {
        viewer {
          organization {
            urlKey
          }
        }
        favorites {
          nodes {
            id
            type
            url
            customView {
              id
              color
              icon
              name
            }
            cycle {
              id
              number
              startsAt
              endsAt
              completedAt
              team {
                key
              }
            }
            document {
              id
              color
              slugId
              title
            }
            issue {
              id
              state {
                id
                type
                name
                color
              }
              title
              url
            }
            label {
              id
              color
              name
            }
            project {
              id
              color
              icon
              name
              url
            }
            initiative {
              id
              color
              icon
              name
            }
            user {
              id
              avatarUrl
              displayName
              name
              url
            }
            updatedAt
          }
        }
      }
    `);return{organization:t?.viewer.organization,favorites:t?.favorites.nodes}}var Qt=require("@raycast/api");var ys=require("@raycast/api"),Wt=!1;async function hs(){Wt=!!(await(0,ys.getApplications)()).find(s=>s.bundleId==="com.linear")}var zt=require("react/jsx-runtime");function Ce({title:e,url:t,...s}){return Wt?(0,zt.jsx)(Qt.Action.Open,{title:`${e||"Open"} in Linear`,icon:"linear-app-icon.png",target:t,application:"Linear",...s}):(0,zt.jsx)(Qt.Action.OpenInBrowser,{url:t,title:`${e||"Open"} in Browser`})}var et=require("@raycast/api"),ks=require("@raycast/utils"),Ct=dt(require("react"));var Ye=require("react/jsx-runtime");function Gi({children:e}){return(0,Ct.useEffect)(()=>{hs()},[]),e}var Bt=class extends Ct.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}render(){let{error:t}=this.state;if(!t)return this.props.children;if(!(t.message.includes("invalid_grant")||t.message.includes("Error while fetching tokens")||t.message.includes("Could not initialize OAuth")))throw t;return(0,Ye.jsx)(et.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${t.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,Ye.jsx)(et.ActionPanel,{children:(0,Ye.jsx)(et.Action,{title:"Sign in Again",onAction:async()=>{await qt.client.removeTokens(),this.setState({error:null})}})})})}},_i=(0,ks.withAccessToken)(qt)(Gi);function bt({children:e}){return(0,Ye.jsx)(Bt,{children:(0,Ye.jsx)(_i,{children:e})})}var ce=require("date-fns"),Hi=10080*60*1e3;function pe(e){let t=Date.now(),s=Date.now()+Hi,o=new Date(e.startsAt),i=new Date(e.endsAt),c=!e.completedAt&&(0,ce.isBefore)(o,t)&&(0,ce.isAfter)(i,t),a=!e.completedAt&&(0,ce.isBefore)(o,s)&&(0,ce.isAfter)(i,s),n=c?{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}:{light:"light/cycle.svg",dark:"dark/cycle.svg"},r=`Cycle ${e.number} (${(0,ce.format)(o,"dd MMM")} - ${(0,ce.format)(i,"dd MMM")})`,u=c?`Active ${r}`:r;return{...e,isActive:c,isNext:a,icon:n,title:u}}function be(e){return e.filter(t=>(0,ce.isAfter)(new Date(t.endsAt),Date.now())).map(pe)}function Ps(e){return e?{title:"Open Label",url:e}:null}var ws=dt(require("fs")),Cs=require("@raycast/api"),bs=dt(require("node-emoji"));function ge({icon:e,color:t,fallbackIcon:s}){if(!e)return s;if(/:(.*):/.test(e))return bs.get(e)??s;let i=`${Cs.environment.assetsPath}/linear-icons/${e.toLowerCase()}.svg`;return ws.default.existsSync(i)?{source:i,...t?{tintColor:{light:t,dark:t,adjustContrast:!0}}:{}}:s}function Ss(e){return ge({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/initiative.svg",dark:"dark/initiative.svg"}}})}function Y(e){return e?ge({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var As=require("lodash");var Zi={triage:{light:"light/triage.svg",dark:"dark/triage.svg"},backlog:{light:"light/backlog.svg",dark:"dark/backlog.svg"},unstarted:{light:"light/unstarted.svg",dark:"dark/unstarted.svg"},started:{light:"light/started.svg",dark:"dark/started.svg"},completed:{light:"light/completed.svg",dark:"dark/completed.svg"},canceled:{light:"light/canceled.svg",dark:"dark/canceled.svg"}};function z(e){return{source:Zi[e.type],tintColor:{light:e.color,dark:e.color,adjustContrast:!0}}}function tt(e,t=["triage","backlog","unstarted","started","completed","canceled"]){if(e.length===0)return[];let s=(0,As.groupBy)(e,o=>o.type);return t.filter(o=>!!s[o]).map(o=>s[o]).flat()}var St=require("@raycast/api"),Ls=require("@raycast/utils");function _(e){return e?{source:e.avatarUrl?encodeURI(e.avatarUrl):(0,Ls.getAvatarIcon)(e.displayName.toUpperCase()),mask:St.Image.Mask.Circle}:St.Icon.Person}var de=require("@raycast/api"),xi=require("react");var ke=require("@raycast/api"),Ut=require("date-fns");var st=require("@raycast/api"),At=require("date-fns");function Lt(e){let t=(0,At.differenceInDays)(e,(0,At.startOfToday)()),s=st.Color.PrimaryText;return t<=7&&(s=st.Color.Orange),t<=0&&(s=st.Color.Red),{source:st.Icon.Calendar,tintColor:s}}var Ts={exponential:[0,1,2,4,8,16,32,64],fibonacci:[0,1,2,3,5,8,13,21],linear:[0,1,2,3,4,5,6,7],tShirt:[0,1,2,3,5,8,13,21]},$s={0:"\u2013",1:"XS",2:"S",3:"M",5:"L",8:"XL",13:"XXL",21:"XXXL"};function Tt({estimate:e,issueEstimationType:t}){if(!e)return"Not estimated";if(t==="tShirt"){let s=$s[e];return s||String(e)}return String(e)}function it({issueEstimationType:e,issueEstimationAllowZero:t,issueEstimationExtended:s}){if(e==="notUsed")return null;let o=t?0:1,i=s?Ts[e].length:6,c=Ts[e].slice(o,i);return e==="tShirt"?c.map(a=>({estimate:a,label:$s[a]})):c.map(a=>({estimate:a,label:a!==1?`${a} points`:`${a} point`}))}var ue={0:{light:"light/priority-no-priority.svg",dark:"dark/priority-no-priority.svg"},1:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"},2:{light:"light/priority-high.svg",dark:"dark/priority-high.svg"},3:{light:"light/priority-medium.svg",dark:"dark/priority-medium.svg"},4:{light:"light/priority-low.svg",dark:"dark/priority-low.svg"}};var g=require("@raycast/api"),us=require("date-fns"),$i=require("react");function W(e){return e instanceof Error?e.message:String(e)}var Rs=require("@raycast/utils");function Fe(e=""){let{linearClient:t}=h(),{data:s,error:o,isLoading:i}=(0,Rs.useCachedPromise)(async c=>{let a=await t.users(c.trim().length>0?{filter:{name:{containsIgnoreCase:c}}}:void 0);return{users:a?.nodes??[],hasMoreUsers:!!a?.pageInfo?.hasNextPage}},[e],{initialData:[]});return{users:s?.users,supportsUserTypeahead:e.trim().length>0||s?.hasMoreUsers,usersError:o,isLoadingUsers:!s&&!o||i}}var A=require("@raycast/api"),Vs=require("@raycast/utils"),qs=require("nanoid"),Oe=require("react");var Ds=require("@raycast/api");async function pt(e,t,s,o,i){let c=o,a=!0,n,r=0;for(;a&&r<i;){let u=await e(n);c=s(c,u),a=t(u)?.hasNextPage,n=t(u)?.endCursor,r++}return c}var Ki=(0,Ds.getPreferenceValues)();function vs({inFilterBlock:e,addComma:t,inParentheses:s}={inFilterBlock:!1,inParentheses:!1,addComma:!0}){return Ki.shouldHideRedundantIssues?[...s?["("]:[],...t?[", "]:[],...e?[]:["filter: { "],"completedAt: { null: true }, canceledAt: { null: true }",...e?[]:[" }"],...s?[")"]:[]].join(""):""}var Ee=`
  id
  identifier
  title
  branchName
  priority
  priorityLabel
  estimate
  dueDate
  updatedAt
  url
  number
  labels {
    nodes {
      id
      name
      color
    }
  }
  state {
    id
    type
    name
    color
  }
  assignee {
    id
    displayName
    email
    avatarUrl
  }
  team {
    id
    issueEstimationType
    issueEstimationAllowZero
    issueEstimationExtended
    activeCycle {
      id
    }
  }
  cycle {
    id
    number
    startsAt
    endsAt
    completedAt
  }
  parent {
    id
    title
    number
    state {
      type
      color
    }
  }
  project {
    id
    name
    icon
    color
  }
  projectMilestone {
    id
    name
  }
`;async function ot(){let{graphQLClient:e}=h(),{data:t}=await e.rawRequest(`
      query {
        issues(orderBy: createdAt${vs()}) {
          nodes {
            ${Ee}
          }
        }
      }
    `);return t?.issues.nodes}async function xs(e){let{graphQLClient:t}=h(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          children${vs({inParentheses:!0})} {
            nodes {
              ${Ee}
              sortOrder
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.children.nodes}async function js(e){let{graphQLClient:t}=h(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          identifier
          title
          branchName
          description
          team {
            name
          }
          labels {
            nodes {
              name
            }
          }
          project {
            name
            description
          }
          parent {
            id
            identifier
            title
            description
          }
          children {
            nodes {
              id
              identifier
              title
              description
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}async function Ms(e){let{graphQLClient:t}=h(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          comments {
            nodes {
              id
              body
              createdAt
              url
              user {
                id
                displayName
                email
                avatarUrl
              }
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.comments.nodes}async function Us(e){let{graphQLClient:t}=h(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          ${Ee}
          attachments {
            nodes {
              id
              title
              subtitle
              source
              url
              updatedAt
            }
          }
          description
          relations {
            nodes {
              id
              type
              relatedIssue {
                id
                identifier
                title
                state {
                  color
                  type
                }
              }
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}async function Fs(e){let{graphQLClient:t}=h(),s=e.title.replace(/"/g,"\\$&"),o=e.description?.replace(/\n/g,"\\n")?.replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${o}", priority: ${e.priority}`;e.stateId&&(i+=`, stateId: "${e.stateId}"`),e.estimate&&(i+=`, estimate: ${e.estimate}`),e.assigneeId&&(i+=`, assigneeId: "${e.assigneeId}"`),e.labelIds&&e.labelIds.length>0&&(i+=`, labelIds: [${e.labelIds.map(a=>`"${a}"`).join(",")}]`),e.dueDate&&(i+=`, dueDate: "${e.dueDate.toISOString()}"`),e.cycleId&&(i+=`, cycleId: "${e.cycleId}"`),e.projectId&&(i+=`, projectId: "${e.projectId}"`),e.projectId&&e.projectMilestoneId&&(i+=`, projectMilestoneId: "${e.projectMilestoneId}"`),e.parentId&&(i+=`, parentId: "${e.parentId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
          issue {
            ${Ee}
          }
        }
      }
    `);return{success:c?.issueCreate.success,issue:c?.issueCreate.issue}}async function Es(e){let{graphQLClient:t}=h(),s=e.title.replace(/"/g,"\\$&"),o=e.description?.replace(/\n/g,"\\n").replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${o}", parentId: "${e.parentId}"`;e.stateId&&(i+=`, stateId: "${e.stateId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
        }
      }
    `);return{success:c?.issueCreate.success}}var Ns=require("@raycast/utils");function Ne(e){let t=e.id,{data:s,error:o,isLoading:i,mutate:c}=(0,Ns.useCachedPromise)(Us,[t],{initialData:{...e,description:""}});return{issue:s,issueError:o,isLoadingIssue:i,mutateDetail:c}}var Os=require("@raycast/utils");function fe(e,t){let{linearClient:s}=h(),{data:o,error:i,isLoading:c}=(0,Os.useCachedPromise)(async a=>(await s.workflowStates({filter:{team:{id:{eq:a}}}})).nodes.sort((r,u)=>r.position-u.position),[e],{initialData:[],execute:t?.execute!==!1});return{states:o,isLoadingStates:c,statesError:i}}var se=require("react/jsx-runtime");function Gt({issue:e}){let{pop:t}=(0,A.useNavigation)(),{states:s}=fe(e.team.id),o=(0,Oe.useMemo)(()=>s.filter(S=>S.type==="unstarted")[0],[s]),{issue:i,isLoadingIssue:c}=Ne(e),{data:a,isLoading:n,revalidate:r}=(0,Vs.useAI)(`Act as a product manager for Linear issues. Break down a Linear issue into a list of sub-issues. 
    
Follow these instructions:
- The sub-issues should be actionable.
- Every sub-issue should have a title and description
- Don't repeat the issue title in the description.
- Create as many sub-issues as it makes sense. Don't create too many or too few.

Use this JSON format:
[
  {
    "title": "<title of sub-issue>",
    "description": "<description of sub-issue>"
  },
  ...
]

${i.description?`To give you more context and help in creating sub-issues, here's the Linear issue description:
"""
${i.description}
"""
`:""}

Break down the Linear issue with this title: "${i.title}"`,{execute:!!i&&!c,creativity:.5}),[u,d]=(0,Oe.useState)(!1),[P,L]=(0,Oe.useState)([]);(0,Oe.useEffect)(()=>{if(!(!a||n)){try{let $=/\[[\s\S]*?\]/,S=a.match($);if(S&&S[0]){let H=JSON.parse(S[0]);L(H.map(R=>({...R,id:(0,qs.nanoid)(),selected:!0})))}}catch($){(0,A.showToast)({style:A.Toast.Style.Failure,title:"Failed to parse AI results",message:W($),primaryAction:{title:"Retry",onAction:r},secondaryAction:{title:"Copy AI Result",onAction:()=>A.Clipboard.copy(a)}})}d(!0)}},[a,n]);async function T(){try{await(0,A.showToast)({style:A.Toast.Style.Animated,title:"Creating sub-issues"});let $=P.filter(S=>S.selected);await Promise.all($.map(S=>Es({teamId:i.team.id,title:S.title,description:S.description,parentId:i.id,stateId:o?.id}))),await(0,A.showToast)({style:A.Toast.Style.Success,title:"Created sub-issues"}),t()}catch($){(0,A.showToast)({style:A.Toast.Style.Failure,title:"Failed to create Sub-Issues",message:W($)})}}return(0,se.jsxs)(A.List,{isLoading:n||!u,children:[P?.map($=>(0,se.jsx)(A.List.Item,{icon:$.selected?{source:A.Icon.CheckCircle,tintColor:A.Color.Green}:A.Icon.Circle,title:$.title,subtitle:$.description,actions:(0,se.jsxs)(A.ActionPanel,{children:[(0,se.jsx)(A.Action,{title:$.selected?"Unselect Sub-Issue":"Select Sub-Issue",icon:$.selected?A.Icon.Circle:{source:A.Icon.CheckCircle,tintColor:A.Color.Green},onAction:()=>L(P.map(S=>S.id===$.id?{...S,selected:!S.selected}:S))}),(0,se.jsx)(A.Action,{title:"Create Sub-Issues",icon:A.Icon.Plus,onAction:()=>T()}),(0,se.jsx)(A.Action,{title:"Generate New Sub-Issues",icon:A.Icon.ArrowClockwise,onAction:r})]})},$.title)),(0,se.jsx)(A.List.EmptyView,{title:"No sub-issues were generated. Try again.",actions:(0,se.jsx)(A.ActionPanel,{children:(0,se.jsx)(A.Action,{title:"Retry",icon:A.Icon.ArrowClockwise,onAction:r})})})]})}var y=require("@raycast/api"),ze=require("@raycast/utils"),ft=require("react");async function Ws(e,t){let{graphQLClient:s}=h(),o=[];if(t.teamId&&o.push(`teamId: "${t.teamId}"`),t.title&&o.push(`title: "${t.title.replace(/"/g,"\\$&")}"`),t.description&&o.push(`description: "${t.description.replace(/\n/g,"\\n").replace(/"/g,"\\$&")}"`),t.stateId&&o.push(`stateId: "${t.stateId}"`),typeof t.priority<"u"&&o.push(`priority: ${t.priority}`),typeof t.assigneeId<"u"&&o.push(`assigneeId: ${t.assigneeId?`"${t.assigneeId}"`:null}`),t.labelIds&&o.push(`labelIds: [${t.labelIds.map(c=>`"${c}"`).join(",")}]`),typeof t.estimate<"u"&&o.push(`estimate: ${t.estimate}`),typeof t.dueDate<"u"){let c=t.dueDate?t.dueDate instanceof Date?t.dueDate.toISOString():t.dueDate:null;o.push(`dueDate: ${c?`"${c}"`:null}`)}typeof t.cycleId<"u"&&o.push(`cycleId: ${t.cycleId?`"${t.cycleId}"`:null}`),typeof t.projectId<"u"&&o.push(`projectId: ${t.projectId?`"${t.projectId}"`:null}`),typeof t.projectMilestoneId<"u"&&o.push(`projectMilestoneId: ${t.projectMilestoneId?`"${t.projectMilestoneId}"`:null}`),typeof t.parentId<"u"&&o.push(`parentId: ${t.parentId?`"${t.parentId}"`:null}`);let{data:i}=await s.rawRequest(`
      mutation {
        issueUpdate(id: "${e}", input: {${o.join(", ")}}) {
          success
        }
      }
    `);return{success:i?.issueUpdate.success}}var _t=require("@raycast/api");function Se(e){return e?{source:"linear-icons/milestone.svg",tintColor:_t.Color.PrimaryText}:{source:"linear-icons/no-milestone.svg",tintColor:_t.Color.SecondaryText}}var Qs=require("@raycast/api");function $t(e,t){let s=t?.logoUrl?encodeURI(t.logoUrl):Qs.Icon.TwoPeople;return ge({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:s})}var zs=require("@raycast/utils");function Ve(e,t){let{linearClient:s}=h(),{data:o,error:i,isLoading:c}=(0,zs.useCachedPromise)(async a=>(await s.cycles({filter:{team:{id:{eq:a}}}})).nodes.sort((r,u)=>r.number-u.number),[e],{execute:t?.execute!==!1&&!!e});return{cycles:o,cyclesError:i,isLoadingCycles:!o&&!i||c}}var Bs=require("@raycast/utils");function Ie(e,t=[],s){let{data:o,error:i,isLoading:c,mutate:a}=(0,Bs.useCachedPromise)(e,t,s);return{issues:o,issuesError:i,isLoadingIssues:c,mutateList:a}}var Hs=require("@raycast/utils");var Gs=require("@raycast/api");var Xi=100,Ji=100,Yi=(0,Gs.getPreferenceValues)();function eo(){let e=Number(Yi.labelsLimit),t=Number.isFinite(e)&&e>0?e:Ji,s=Math.floor(Math.min(Xi,t)),o=Math.ceil(t/s);return{pageSize:s,pageLimit:o}}async function _s(e){if(!e)return[];let{pageSize:t,pageLimit:s}=eo(),{graphQLClient:o}=h();return pt(async i=>o.rawRequest(`
          query($teamId: String!, $cursor: String) {
            team(id: $teamId) {
              labels(first: ${t}, after: $cursor) {
                nodes {
                  id
                  name
                  color
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,{teamId:e,cursor:i}),i=>i.data?.team?.labels?.pageInfo,(i,c)=>i.concat(c.data?.team?.labels?.nodes??[]),[],s)}function qe(e,t){let{data:s,error:o,isLoading:i}=(0,Hs.useCachedPromise)(_s,[e],{execute:t?.execute!==!1&&!!e});return{labels:s,labelsError:o,isLoadingLabels:!s&&!o||i}}var Ks=require("@raycast/utils");var to=`
  id
  name
  targetDate
  project {
      id
  }
  sortOrder
  updatedAt
`;async function Zs(e){let{graphQLClient:t}=h();if(e){let{data:s}=await t.rawRequest(`
        query($projectId: String!) {
          project(id: $projectId) {
            projectMilestones {
              nodes {
                ${to}
              }
            }
          }
        }
      `,{projectId:e});return s?.project.projectMilestones.nodes}return null}function We(e,t){let{data:s,error:o,isLoading:i,mutate:c}=(0,Ks.useCachedPromise)(Zs,[e],{execute:t?.execute!==!1});return{milestones:s,isLoadingMilestones:!s&&!o||i,milestonesError:o,mutateMilestones:c}}var Js=require("@raycast/utils");var so=`
  id
  name
  description
  icon
  color
  progress
  url
  status {
    id
    name
    type
    color
  }
  lead {
    id
    displayName
    avatarUrl
    email
  }
  startDate
  targetDate
  members {
    nodes {
      id
    }
  }
  teams {
    nodes {
      key
      id
    }
  }
`;async function Xs({teamId:e,searchText:t="",after:s=null,first:o=null}){let{graphQLClient:i}=h(),c=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${so}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;if(!e){let{data:r}=await i.rawRequest(`
        query($first: Int, $after: String, $searchText: String) {
          ${c}
        }
      `,{first:o,after:s,searchText:t}),u=r?.projects;return{data:u?.nodes??[],hasMore:!!u?.pageInfo.hasNextPage,cursor:u?.pageInfo.endCursor||null}}let{data:a}=await i.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${c}
        }
      }
    `,{teamId:e,first:o,after:s,searchText:t}),n=a?.team?.projects;return{data:n?.nodes??[],hasMore:!!n?.pageInfo.hasNextPage,cursor:n?.pageInfo.endCursor||null}}function Qe(e,t){let{data:s,error:o,isLoading:i,mutate:c,pagination:a}=(0,Js.useCachedPromise)((n,r)=>u=>Xs({teamId:n,searchText:r,after:u.cursor,first:t?.pageSize}),[e,t?.searchText],{execute:t?.execute!==!1,keepPreviousData:!0});return{projects:s,isLoadingProjects:!s&&!o||i,projectsError:o,mutateProjects:c,pagination:a}}var ti=require("@raycast/utils");var Ys=require("lodash");async function ei(e=""){let{graphQLClient:t,linearClient:s}=h(),o=await s.viewer,{data:i}=await t.rawRequest(`
      query($userId: String!, $query: String!) {
        organization {
          logoUrl
        }
        teams(filter: {name: {containsIgnoreCase: $query}}) {
          nodes {
            id
            name
            icon
            color
            key
            membership(userId: $userId) {
              sortOrder
            }
            issueEstimationType
            issueEstimationAllowZero
            issueEstimationExtended
            activeCycle {
              id
              number
            }
          }
          pageInfo {
            hasNextPage
          }
        }
      }
    `,{userId:o.id,query:e}),c=(0,Ys.sortBy)(i?.teams.nodes??[],r=>r.membership?.sortOrder??1/0),a=i?.organization,n=!!i?.teams.pageInfo.hasNextPage;return{teams:c,organization:a,hasMoreTeams:n}}function gt(e=""){let{data:t,error:s,isLoading:o}=(0,ti.useCachedPromise)(ei,[e]);return{teams:t?.teams,org:t?.organization,teamsError:s,isLoadingTeams:!t&&!s||o,supportsTeamTypeahead:e.trim().length>0||t?.hasMoreTeams}}var b=require("react/jsx-runtime");function Ht(e){let{pop:t}=(0,y.useNavigation)(),{issue:s,isLoadingIssue:o,mutateDetail:i}=Ne(e.issue),[c,a]=(0,ft.useState)(""),{teams:n,org:r,supportsTeamTypeahead:u,isLoadingTeams:d}=gt(c),P=n&&n.length>1,[L,T]=(0,ft.useState)(""),{users:$,supportsUserTypeahead:S,isLoadingUsers:H}=Fe(L),{handleSubmit:R,itemProps:C,values:v,setValue:j}=(0,ze.useForm)({async onSubmit(p){let K=await(0,y.showToast)({style:y.Toast.Style.Animated,title:"Editing issue"});try{let me={teamId:p.teamId||e.issue.team.id,title:p.title,description:p.description,stateId:p.stateId,labelIds:p.labelIds,dueDate:p.dueDate,...B&&p.estimate?{estimate:parseInt(p.estimate)}:{},...p.assigneeId?{assigneeId:p.assigneeId}:{},...p.cycleId?{cycleId:p.cycleId}:{},...p.projectId?{projectId:p.projectId}:{},...p.milestoneId?{projectMilestoneId:p.milestoneId}:{},...p.parentId?{parentId:p.parentId}:{},priority:parseInt(p.priority)},{success:ut}=await Ws(s.id,me);ut&&(K.style=y.Toast.Style.Success,K.title=`Edited Issue \u2022 ${s.identifier}`,t(),i(),e.mutateList&&e.mutateList(),e.mutateSubIssues&&e.mutateSubIssues())}catch(me){K.style=y.Toast.Style.Failure,K.title="Failed to edit issue",K.message=W(me)}},validation:{teamId:P?ze.FormValidation.Required:void 0,title:ze.FormValidation.Required,stateId:ze.FormValidation.Required,priority:ze.FormValidation.Required},initialValues:{teamId:e.issue.team.id,title:e.issue.title,description:s.description??void 0,priority:String(e.issue.priority),stateId:e.issue.state.id,estimate:e.issue.estimate?String(e.issue.estimate):void 0,assigneeId:e.issue.assignee?.id,labelIds:e.issue.labels.nodes.map(p=>p.id),dueDate:s.dueDate?new Date(s.dueDate):null,cycleId:e.issue.cycle?.id,projectId:e.issue.project?.id,milestoneId:e.issue.projectMilestone?.id,parentId:e.issue.parent?.id}});(0,ft.useEffect)(()=>{j("description",s.description||""),j("dueDate",s.dueDate?new Date(s.dueDate):null)},[s]);let J=!!v.teamId&&v.teamId.trim().length>0,{states:ve}=fe(v.teamId,{execute:J}),{labels:Z}=qe(v.teamId,{execute:J}),{cycles:le}=Ve(v.teamId,{execute:J}),{issues:Pe}=Ie(ot,[],{execute:J}),{projects:I}=Qe(v.teamId,{execute:J}),{milestones:D}=We(v.projectId,{execute:!!v.projectId}),x=n?.find(p=>p.id===v.teamId),B=x?it({issueEstimationType:x.issueEstimationType,issueEstimationAllowZero:x.issueEstimationAllowZero,issueEstimationExtended:x.issueEstimationExtended}):null,xe=tt(ve||[]),je=ve&&ve.length>0,Xe=e.priorities&&e.priorities.length>0,te=Z&&Z.length>0,N=le&&le.length>0,O=I&&I.length>0,Et=D&&D.length>0,Pt=Pe&&Pe.length>0;return(0,b.jsxs)(y.Form,{actions:(0,b.jsx)(y.ActionPanel,{children:(0,b.jsx)(y.Action.SubmitForm,{onSubmit:R,title:"Edit Issue"})}),isLoading:d||o||H,children:[(u||P)&&(0,b.jsxs)(b.Fragment,{children:[(0,b.jsx)(y.Form.Dropdown,{title:"Team",...C.teamId,...u&&{onSearchTextChange:a,isLoading:d,throttle:!0},children:n?.map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:$t(p,r)},p.id))}),(0,b.jsx)(y.Form.Separator,{})]}),(0,b.jsx)(y.Form.TextField,{title:"Title",placeholder:"Issue title",autoFocus:!0,...C.title}),(0,b.jsx)(y.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...C.description}),(0,b.jsx)(y.Form.Dropdown,{title:"Status",...C.stateId,children:je?xe.map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:z(p)},p.id)):null}),(0,b.jsx)(y.Form.Dropdown,{title:"Priority",...C.priority,children:Xe?e.priorities?.map(({priority:p,label:K})=>(0,b.jsx)(y.Form.Dropdown.Item,{title:K,value:String(p),icon:{source:ue[p]}},p)):null}),(0,b.jsxs)(y.Form.Dropdown,{title:"Assignee",...C.assigneeId,...S&&{onSearchTextChange:T,isLoading:H,throttle:!0},children:[(0,b.jsx)(y.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:y.Icon.Person}),$?.map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:_(p)},p.id))]}),(0,b.jsx)(y.Form.TagPicker,{title:"Labels",...C.labelIds,placeholder:"Add label",children:te?Z.map(({id:p,name:K,color:me})=>(0,b.jsx)(y.Form.TagPicker.Item,{title:K,value:p,icon:{source:y.Icon.Dot,tintColor:me}},p)):null}),B?(0,b.jsxs)(y.Form.Dropdown,{title:"Estimate",...C.estimate,children:[(0,b.jsx)(y.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),B.map(({estimate:p,label:K})=>(0,b.jsx)(y.Form.Dropdown.Item,{title:K,value:String(p),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},p))]}):null,(0,b.jsx)(y.Form.DatePicker,{title:"Due Date",type:y.Form.DatePicker.Type.Date,...C.dueDate}),N||O||Pt?(0,b.jsx)(y.Form.Separator,{}):null,N?(0,b.jsxs)(y.Form.Dropdown,{title:"Cycle",...C.cycleId,children:[(0,b.jsx)(y.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),be(le).map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:p.title,value:p.id,icon:{source:p.icon}},p.id))]}):null,O?(0,b.jsxs)(y.Form.Dropdown,{title:"Project",...C.projectId,children:[(0,b.jsx)(y.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),I.map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:`${p.name} (${p.status.name})`,value:p.id,icon:Y(p)},p.id))]}):null,Et?(0,b.jsxs)(y.Form.Dropdown,{title:"Milestone",storeValue:!0,...C.milestoneId,children:[(0,b.jsx)(y.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),D.map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:`${p.name}  (${p.targetDate||"No Target Date"})`,value:p.id,icon:Se(p)},p.id))]}):null,Pt?(0,b.jsxs)(y.Form.Dropdown,{title:"Parent",...C.parentId,children:[(0,b.jsx)(y.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),Pe.map(p=>(0,b.jsx)(y.Form.Dropdown.Item,{title:`${p.identifier} - ${p.title}`,value:p.id,icon:z(p.state)},p.id))]}):null]})}var ie=require("@raycast/api"),oi=require("date-fns");var V=require("@raycast/api"),ii=require("@raycast/utils");var si=require("fs/promises"),Zt=dt(require("path"));var io="application/octet-stream",oo={".apng":"image/apng",".avif":"image/avif",".bmp":"image/bmp",".csv":"text/csv",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",".gif":"image/gif",".gz":"application/gzip",".heic":"image/heic",".heif":"image/heif",".ico":"image/x-icon",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json",".md":"text/markdown",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".pdf":"application/pdf",".png":"image/png",".ppt":"application/vnd.ms-powerpoint",".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",".svg":"image/svg+xml",".tar":"application/x-tar",".tif":"image/tiff",".tiff":"image/tiff",".txt":"text/plain",".webm":"video/webm",".webp":"image/webp",".xls":"application/vnd.ms-excel",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".zip":"application/zip"};function ro(e){return oo[Zt.default.extname(e).toLowerCase()]??io}async function no(e){let{graphQLClient:t}=h(),s=await(0,si.readFile)(e),o=ro(e),i=Zt.default.basename(e),{data:c}=await t.rawRequest(`
      mutation FileUpload($size: Int!, $contentType: String!, $filename: String!) {
        fileUpload(size: $size, contentType: $contentType, filename: $filename) {
          success
          uploadFile {
            headers {
              key
              value
            }
            uploadUrl
            assetUrl
          }
        }
      }
    `,{size:s.byteLength,contentType:o,filename:i}),a=c?.fileUpload.uploadFile;if(!c?.fileUpload.success||!a)throw new Error(`Failed to request an upload URL for "${i}"`);let n=new Headers({"Content-Type":o,"Cache-Control":"public, max-age=31536000"});a.headers.forEach(({key:u,value:d})=>n.set(u,d));let r=await fetch(a.uploadUrl,{method:"PUT",headers:n,body:s});if(!r.ok)throw new Error(`Failed to upload "${i}": ${r.status} ${r.statusText}`);return{assetUrl:a.assetUrl,contentType:o,name:i}}async function Rt(e){let{linearClient:t}=h(),s=await no(e.url),o=await t.createAttachment({issueId:e.issueId,title:s.name,url:s.assetUrl});return{success:o.success,id:o.attachmentId}}async function Dt(e){let{linearClient:t}=h(),s=await t.attachmentLinkURL(e.issueId,e.url);return{success:s.success,id:s.attachmentId}}function vt(e){let t=e.split(`
`),s=/https?:\/\/\S+/,o=t.map(i=>i.trim()).filter(i=>s.test(i));return Array.from(new Set(o))}var Ae=require("react/jsx-runtime");function xt({issue:{id:e,title:t,identifier:s}}){let{pop:o}=(0,V.useNavigation)(),{reset:i,itemProps:c,handleSubmit:a}=(0,ii.useForm)({onSubmit:async n=>{let r=await(0,V.showToast)({style:V.Toast.Style.Animated,title:"Attaching links"}),u=vt(n.links);if(u.length===0&&n.attachments.length===0){r.style=V.Toast.Style.Failure,r.title="No links or attachments provided";return}if(u.length>0){let d=u.length===1?"link":"links";try{await Promise.all(u.map(P=>Dt({issueId:e,url:P}))),r.style=V.Toast.Style.Success,r.title=`Successfully attached ${d}`}catch(P){r.style=V.Toast.Style.Failure,r.title=`Failed attaching ${d}`,r.message=W(P)}}if(n.attachments.length>0){let d=n.attachments.length===1?"attachment":"attachments";try{r.style=V.Toast.Style.Animated,r.title=`Uploading ${d}\u2026`,await Promise.all(n.attachments.map(P=>Rt({issueId:e,url:P}))),r.style=V.Toast.Style.Success,r.title=`Successfully uploaded ${d}`}catch(P){r.style=V.Toast.Style.Failure,r.title=`Failed uploading ${d}`,r.message=W(P)}}i({attachments:[],links:""}),o()},initialValues:{links:""}});return(0,Ae.jsxs)(V.Form,{actions:(0,Ae.jsx)(V.ActionPanel,{children:(0,Ae.jsx)(V.Action.SubmitForm,{onSubmit:a,icon:V.Icon.NewDocument,title:"Attach"})}),navigationTitle:"Add Attachments and Links",children:[(0,Ae.jsx)(V.Form.Description,{title:"Issue",text:`[${s}] ${t}`}),(0,Ae.jsx)(V.Form.FilePicker,{title:"Attachment",...c.attachments}),(0,Ae.jsx)(V.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...c.links})]})}var Le=require("react/jsx-runtime");function Kt({attachments:e,issue:t}){return(0,Le.jsx)(ie.List,{navigationTitle:`Links for ${t.identifier}`,children:e.map(s=>{let o=new Date(s.updatedAt);return(0,Le.jsx)(ie.List.Item,{icon:s.source?.imageUrl??ie.Icon.Link,title:s.title,subtitle:s.subtitle,accessories:[{date:o,tooltip:`Updated: ${(0,oi.format)(o,"EEEE d MMMM yyyy 'at' HH:mm")}`}],actions:(0,Le.jsxs)(ie.ActionPanel,{children:[(0,Le.jsx)(ie.Action.OpenInBrowser,{url:s.url}),(0,Le.jsx)(ie.Action.Push,{title:"Add Attachments and Links",icon:ie.Icon.NewDocument,target:(0,Le.jsx)(xt,{issue:t})})]})},s.id)})})}var Q=require("@raycast/api"),ri=require("react");var It=require("react/jsx-runtime");function Be({comment:e,issue:t,mutateComments:s}){let{linearClient:o}=h(),{pop:i}=(0,Q.useNavigation)(),[c,a]=(0,ri.useState)(e?e.body:"");async function n(){await(0,Q.showToast)({style:Q.Toast.Style.Animated,title:`${e?"Updating":"Adding"} comment`});try{e?await o.updateComment(e.id,{body:c}):await o.createComment({body:c,issueId:t.id}),await(0,Q.showToast)({style:Q.Toast.Style.Success,title:`${e?"Updated":"Added"} comment`}),i(),s&&s()}catch(r){(0,Q.showToast)({style:Q.Toast.Style.Failure,title:`Failed to ${e?"update":"add"} comment`,message:W(r)})}}return(0,It.jsx)(Q.Form,{actions:(0,It.jsx)(Q.ActionPanel,{children:(0,It.jsx)(Q.Action.SubmitForm,{title:e?"Edit Comment":"Add Comment",onSubmit:n,icon:e?Q.Icon.Pencil:Q.Icon.Plus})}),children:(0,It.jsx)(Q.Form.TextArea,{id:"comment",title:"Comment",placeholder:"Leave a comment",value:c,onChange:a})})}var k=require("@raycast/api"),li=require("date-fns"),ci=dt(require("remove-markdown"));var ni=require("@raycast/utils");function Xt(e){let{data:t,error:s,isLoading:o,mutate:i}=(0,ni.useCachedPromise)(Ms,[e]);return{comments:t,commentsError:s,isLoadingComments:o,mutateComments:i}}var ai=require("@raycast/utils");function Ge(){let{linearClient:e}=h(),{data:t,error:s,isLoading:o}=(0,ai.useCachedPromise)(()=>e.viewer);return{me:t,meError:s,isLoadingMe:!t&&!s||o}}var q=require("react/jsx-runtime");function Jt({issue:e}){let{linearClient:t}=h(),{me:s,isLoadingMe:o}=Ge(),{comments:i,isLoadingComments:c,mutateComments:a}=Xt(e.id);async function n(r){if(await(0,k.confirmAlert)({title:"Delete Comment",message:"Are you sure you want to delete this comment?",icon:{source:k.Icon.Trash,tintColor:k.Color.Red}}))try{await(0,k.showToast)({style:k.Toast.Style.Animated,title:"Deleting comment"}),await a(t.deleteComment(r),{optimisticUpdate(u){return u&&u?.filter(d=>d.id!==r)}}),await(0,k.showToast)({style:k.Toast.Style.Success,title:"Deleted comment"})}catch(u){(0,k.showToast)({style:k.Toast.Style.Failure,title:"Failed to delete comment",message:W(u)})}}return(0,q.jsxs)(k.List,{isLoading:c||o,navigationTitle:`${e.identifier} \u2022 Comments`,searchBarPlaceholder:"Filter by user or comment content",isShowingDetail:!0,children:[(0,q.jsx)(k.List.EmptyView,{title:"No comments",description:"This issue doesn't have any comments.",actions:(0,q.jsx)(k.ActionPanel,{children:(0,q.jsx)(k.Action.Push,{title:"Add Comment",icon:k.Icon.Plus,target:(0,q.jsx)(Be,{issue:e,mutateComments:a})})})}),i?.map(r=>{let u=new Date(r.createdAt);return(0,q.jsx)(k.List.Item,{title:r.user.displayName,subtitle:r.body,icon:_(r.user),keywords:(0,ci.default)(r.body).replace(/\n/g," ").split(" "),accessories:[{date:u,tooltip:`Created: ${(0,li.format)(u,"EEEE d MMMM yyyy 'at' HH:mm")}`}],detail:(0,q.jsx)(k.List.Item.Detail,{markdown:r.body}),actions:(0,q.jsxs)(k.ActionPanel,{children:[(0,q.jsx)(Ce,{title:"Open Comment",url:r.url}),s?.id===r.user.id?(0,q.jsxs)(k.ActionPanel.Section,{children:[(0,q.jsx)(k.Action.Push,{title:"Edit Comment",icon:k.Icon.Pencil,shortcut:k.Keyboard.Shortcut.Common.Edit,target:(0,q.jsx)(Be,{issue:e,comment:r,mutateComments:a})}),(0,q.jsx)(k.Action,{title:"Delete Comment",icon:k.Icon.Trash,style:k.Action.Style.Destructive,shortcut:k.Keyboard.Shortcut.Common.Remove,onAction:()=>n(r.id)})]}):null,(0,q.jsx)(k.ActionPanel.Section,{children:(0,q.jsx)(k.Action.Push,{title:"Add Comment",icon:k.Icon.Plus,shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},target:(0,q.jsx)(Be,{issue:e,mutateComments:a})})}),(0,q.jsxs)(k.ActionPanel.Section,{children:[(0,q.jsx)(k.Action.CopyToClipboard,{icon:k.Icon.Clipboard,content:r.url,title:"Copy Comment URL",shortcut:k.Keyboard.Shortcut.Common.CopyPath}),(0,q.jsx)(k.Action.CopyToClipboard,{icon:k.Icon.Clipboard,content:r.body,title:"Copy Comment",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,q.jsx)(k.ActionPanel.Section,{children:(0,q.jsx)(k.Action,{title:"Refresh",icon:k.Icon.ArrowClockwise,shortcut:k.Keyboard.Shortcut.Common.Refresh,onAction:a})})]})},r.id)})]})}var He=require("@raycast/api");var ui=require("@raycast/utils");function yt(){let{linearClient:e}=h(),{data:t,error:s,isLoading:o}=(0,ui.useCachedPromise)(()=>e.issuePriorityValues,[],{initialData:[]});return{priorities:t,prioritiesError:s,isLoadingPriorities:!t&&!s||o}}var l=require("@raycast/api"),_e=require("@raycast/utils"),$e=require("react");function Yt(e={}){return{title:"",description:"",stateId:"",priority:"",assigneeId:"",labelIds:[],estimate:"",dueDate:null,cycleId:"",projectId:"",milestoneId:"",...e}}function ao(e){if(typeof e=="string")try{let t=JSON.parse(e);return typeof t=="object"&&t!==null?t:{}}catch{return{}}return typeof e=="object"&&e!==null?e:{}}function Te(e){return typeof e=="string"?e:void 0}function di(e){return typeof e=="number"?String(e):Te(e)}function mi(e){if(!Array.isArray(e))return;let t=e.filter(s=>typeof s=="string");return t.length>0?t:void 0}function lo(e){if(typeof e!="string")return;let t=new Date(e);return Number.isNaN(t.getTime())?void 0:t}function pi(e,t={}){let s=ao(e.templateData),o=Yt(t),i=mi(s.labelIds)??mi(s.labels);return{title:Te(s.title)??o.title,description:Te(s.description)??o.description,stateId:Te(s.stateId)??Te(s.statusId)??o.stateId,priority:di(s.priority)??o.priority,assigneeId:Te(s.assigneeId)??o.assigneeId,labelIds:i??o.labelIds,estimate:di(s.estimate)??o.estimate,dueDate:s.dueDate!==void 0?lo(s.dueDate)??null:o.dueDate,cycleId:Te(s.cycleId)??o.cycleId,projectId:Te(s.projectId)??o.projectId,milestoneId:o.milestoneId}}var Ii=require("@raycast/utils");var gi=`
  id
  name
  description
  icon
  color
  sortOrder
  type
  archivedAt
  templateData
  team {
    id
  }
`;function co(e,t){let s=e.type.toLowerCase()==="issue",o=!e.team||e.team.id===t;return s&&!e.archivedAt&&o}function uo(e,t){return(e.sortOrder??0)-(t.sortOrder??0)||e.name.localeCompare(t.name)}async function fi(e){if(!e)return[];let{graphQLClient:t}=h(),{data:s}=await t.rawRequest(`
      query IssueTemplates($teamId: String!, $first: Int) {
        organization {
          templates(first: $first) {
            nodes {
              ${gi}
            }
          }
        }
        team(id: $teamId) {
          templates(first: $first) {
            nodes {
              ${gi}
            }
          }
        }
      }
    `,{teamId:e,first:100});return[...s?.organization?.templates?.nodes??[],...s?.team?.templates?.nodes??[]].filter((i,c,a)=>a.findIndex(n=>n.id===i.id)===c).filter(i=>co(i,e)).sort(uo)}function es(e,t){let{data:s,error:o,isLoading:i}=(0,Ii.useCachedPromise)(fi,[e],{execute:t?.execute!==!1&&!!e});return{issueTemplates:s,issueTemplatesError:o,isLoadingIssueTemplates:!s&&!o||i}}var F=require("@raycast/api"),yi=require("date-fns");var E=require("react/jsx-runtime");function ht({issue:e,mutateList:t,priorities:s,me:o}){let{issue:i,isLoadingIssue:c,mutateDetail:a}=Ne(e),n=`# ${i?.title}`;i?.description&&(n+=`

${i.description}`);let r=i?.cycle?pe(i.cycle):null,u=i.relations?i.relations.nodes.filter(L=>L.type=="related"):null,d=i.relations?i.relations.nodes.filter(L=>L.type=="duplicate"):null,P=i.attachments?.nodes.length??0;return(0,E.jsx)(F.Detail,{markdown:n,isLoading:c,...i?{metadata:(0,E.jsxs)(F.Detail.Metadata,{children:[(0,E.jsx)(F.Detail.Metadata.Label,{title:"Status",text:i.state.name,icon:z(i.state)}),(0,E.jsx)(F.Detail.Metadata.Label,{title:"Priority",text:i.priorityLabel,icon:{source:ue[i.priority]}}),(0,E.jsx)(F.Detail.Metadata.Label,{title:"Assignee",text:i.assignee?i.assignee.displayName:"Unassigned",icon:_(i.assignee)}),i.team.issueEstimationType!=="notUsed"?(0,E.jsx)(F.Detail.Metadata.Label,{title:"Estimate",text:Tt({estimate:i.estimate,issueEstimationType:i.team.issueEstimationType}),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}):null,i.labels.nodes.length>0?(0,E.jsx)(F.Detail.Metadata.TagList,{title:"Labels",children:i.labels.nodes.map(({id:L,name:T,color:$})=>(0,E.jsx)(F.Detail.Metadata.TagList.Item,{text:T,color:$},L))}):(0,E.jsx)(F.Detail.Metadata.Label,{title:"Labels",text:"No Labels"}),i.dueDate?(0,E.jsx)(F.Detail.Metadata.Label,{title:"Due Date",text:(0,yi.format)(new Date(i.dueDate),"MM/dd/yyyy"),icon:Lt(new Date(i.dueDate))}):null,P>0?(0,E.jsx)(F.Detail.Metadata.Label,{title:"Links",text:`${P>1?`${P} links`:"1 link"}`,icon:F.Icon.Link}):null,(0,E.jsx)(F.Detail.Metadata.Separator,{}),(0,E.jsx)(F.Detail.Metadata.Label,{title:"Cycle",text:r?r.title:"No Cycle",icon:{source:r?r.icon:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),(0,E.jsx)(F.Detail.Metadata.Label,{title:"Project",text:i.project?i.project.name:"No Project",icon:Y(i.project)}),(0,E.jsx)(F.Detail.Metadata.Label,{title:"Milestone",text:i.projectMilestone?i.projectMilestone.name:"No Milestone",icon:Se(i.projectMilestone)}),(0,E.jsx)(F.Detail.Metadata.Label,{title:"Parent Issue",text:i.parent?i.parent.title:"No Issue",icon:i.parent?z(i.parent.state):{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),u&&u.length>0?(0,E.jsx)(F.Detail.Metadata.TagList,{title:"Related",children:u.map(({id:L,relatedIssue:T})=>(0,E.jsx)(F.Detail.Metadata.TagList.Item,{text:T.identifier},L))}):null,d&&d.length>0?(0,E.jsx)(F.Detail.Metadata.TagList,{title:"Duplicates",children:d.map(({id:L,relatedIssue:T})=>(0,E.jsx)(F.Detail.Metadata.TagList.Item,{text:T.identifier},L))}):null]}),actions:(0,E.jsx)(F.ActionPanel,{children:(0,E.jsx)(rt,{issue:i,mutateList:t,mutateDetail:a,priorities:s,showAttachmentsAction:P>0,attachments:i.attachments?.nodes??[],me:o})})}:{}})}var f=require("react/jsx-runtime");function mo(e,t){return e==="url"?{title:"Copy Issue URL",onAction:()=>l.Clipboard.copy(t.url)}:e==="id-as-link"?{title:"Copy Issue ID as Link",onAction:()=>l.Clipboard.copy({text:`[${t.identifier}](${t.url})`,html:`<a href="${t.url}">${t.identifier}</a>`})}:e==="title"?{title:"Copy Issue Title",onAction:()=>l.Clipboard.copy(t.title)}:e==="title-as-link"?{title:"Copy Issue Title as Link",onAction:()=>l.Clipboard.copy({text:`[${t.title}](${t.url})`,html:`<a href="${t.url}">${t.title}</a>`})}:{title:"Copy Issue ID",onAction:()=>l.Clipboard.copy(t.identifier)}}function ts(e){let{push:t}=(0,l.useNavigation)(),{autofocusField:s,copyToastAction:o}=(0,l.getPreferenceValues)(),[i,c]=(0,$e.useState)(""),{teams:a,org:n,supportsTeamTypeahead:r,isLoadingTeams:u}=gt(i),d=a&&a.length>1,[P,L]=(0,$e.useState)(""),{users:T,supportsUserTypeahead:$,isLoadingUsers:S}=Fe(P),{handleSubmit:H,itemProps:R,values:C,setValue:v,focus:j,reset:J,setValidationError:ve}=(0,_e.useForm)({async onSubmit(m){let M=await(0,l.showToast)({style:l.Toast.Style.Animated,title:"Creating issue"}),we=d?m.teamId:a?.[0]?.id;if(!we)return ve("teamId","The team is required."),!1;try{let G={teamId:we,title:m.title,description:m.description||"",stateId:m.stateId,labelIds:m.labelIds,dueDate:m.dueDate,...O&&m.estimate?{estimate:parseInt(m.estimate)}:{},...m.assigneeId?{assigneeId:m.assigneeId}:{},...m.cycleId?{cycleId:m.cycleId}:{},...m.projectId?{projectId:m.projectId}:{},...m.milestoneId?{projectMilestoneId:m.milestoneId}:{},...m.parentId?{parentId:m.parentId}:{},priority:parseInt(m.priority)},{success:Ot,issue:Je}=await Fs(G);if(Ot&&Je){M.style=l.Toast.Style.Success,M.title=`Created Issue \u2022 ${Je?.identifier}`,M.primaryAction={title:"Open Issue",shortcut:l.Keyboard.Shortcut.Common.OpenWith,onAction:async()=>{t((0,f.jsx)(ht,{issue:Je,priorities:e.priorities,me:e.me})),await M.hide()}},M.secondaryAction={shortcut:l.Keyboard.Shortcut.Common.Copy,...mo(o,Je)},J({templateId:"",title:"",description:"",estimate:"",labelIds:[],dueDate:null,parentId:"",attachments:[],links:""}),j(d&&s?s:"title");let Vt=vt(m.links);if(Vt.length>0){let Me=Vt.length===1?"link":"links";try{M.message=`Attaching ${Me}\u2026`,await Promise.all(Vt.map(Ue=>Dt({issueId:Je.id,url:Ue}))),M.message=`Successfully attached ${Me}`}catch(Ue){M.style=l.Toast.Style.Failure,M.title=`Failed attaching ${Me}`,M.message=W(Ue)}}if(m.attachments.length>0){let Me=m.attachments.length===1?"attachment":"attachments";try{M.message=`Uploading ${Me}\u2026`,await Promise.all(m.attachments.map(Ue=>Rt({issueId:Je.id,url:Ue}))),M.message=`Successfully uploaded ${Me}`}catch(Ue){M.style=l.Toast.Style.Failure,M.title=`Failed uploading ${Me}`,M.message=W(Ue)}}}}catch(G){M.style=l.Toast.Style.Failure,M.title="Failed to create issue",M.message=W(G)}v("teamId",we)},validation:{teamId:d?_e.FormValidation.Required:void 0,title:_e.FormValidation.Required,stateId:_e.FormValidation.Required,priority:_e.FormValidation.Required},initialValues:{templateId:e.draftValues?.templateId||"",teamId:e.draftValues?.teamId||e.teamId,title:e.draftValues?.title,description:e.draftValues?.description,priority:e.draftValues?.priority,stateId:e.draftValues?.stateId,estimate:e.draftValues?.estimate,assigneeId:e.draftValues?.assigneeId||e.assigneeId,labelIds:e.draftValues?.labelIds||[],dueDate:e.draftValues?.dueDate,cycleId:e.draftValues?.cycleId||e.cycleId,projectId:e.draftValues?.projectId||e.projectId,milestoneId:e.draftValues?.milestoneId||e.milestoneId,parentId:e.draftValues?.parentId||e.parentId,links:e.draftValues?.links||""}}),Z=!!C.teamId&&C.teamId.trim().length>0,{issueTemplates:le,isLoadingIssueTemplates:Pe}=es(C.teamId,{execute:Z}),{states:I}=fe(C.teamId,{execute:Z}),{labels:D}=qe(C.teamId,{execute:Z}),{cycles:x}=Ve(C.teamId,{execute:Z}),{issues:B}=Ie(ot,[],{execute:Z}),{projects:xe}=Qe(C.teamId,{execute:Z}),{milestones:je}=We(C.projectId,{execute:!!C.projectId});(0,$e.useEffect)(()=>{a?.length===1&&v("teamId",a[0].id)},[a]);let Xe=(0,$e.useRef)(!1);(0,$e.useEffect)(()=>{if(!Xe.current){Xe.current=!0;return}te("")},[C.teamId]);function te(m){v("templateId",m);let M=le?.find(Ot=>Ot.id===m),we={assigneeId:e.assigneeId||"",cycleId:e.cycleId||"",projectId:e.projectId||"",milestoneId:e.milestoneId||""},G=M?pi(M,we):Yt(we);v("title",G.title),v("description",G.description),v("stateId",G.stateId),v("priority",G.priority),v("assigneeId",G.assigneeId),v("labelIds",G.labelIds),v("estimate",G.estimate),v("dueDate",G.dueDate),v("cycleId",G.cycleId),v("projectId",G.projectId),v("milestoneId",G.milestoneId??"")}let N=a?.find(m=>m.id===C.teamId),O=N?it({issueEstimationType:N.issueEstimationType,issueEstimationAllowZero:N.issueEstimationAllowZero,issueEstimationExtended:N.issueEstimationExtended}):null,Et=tt(I||[]),Pt=I&&I.length>0,p=e.priorities&&e.priorities.length>0,K=D&&D.length>0,me=x&&x.length>0,ut=xe&&xe.length>0,ds=je&&je.length>0,Nt=B&&B.length>0,Ei=le&&le.length>0;return(0,f.jsxs)(l.Form,{enableDrafts:e.enableDrafts,actions:(0,f.jsxs)(l.ActionPanel,{children:[(0,f.jsx)(l.Action.SubmitForm,{icon:l.Icon.Plus,onSubmit:H,title:"Create Issue"}),(0,f.jsxs)(l.ActionPanel.Section,{children:[(0,f.jsx)(l.Action,{title:"Focus Title",icon:l.Icon.TextInput,onAction:()=>j("title"),shortcut:l.Keyboard.Shortcut.Common.Edit}),(0,f.jsx)(l.Action,{title:"Focus Description",icon:l.Icon.TextInput,onAction:()=>j("description"),shortcut:{modifiers:["ctrl"],key:"e"}}),(0,f.jsx)(l.Action,{title:"Focus Status",icon:l.Icon.Circle,onAction:()=>j("stateId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}}}),(0,f.jsx)(l.Action,{title:"Focus Priority",icon:l.Icon.LevelMeter,onAction:()=>j("priority"),shortcut:l.Keyboard.Shortcut.Common.Pin}),(0,f.jsx)(l.Action,{title:"Focus Assignee",icon:l.Icon.AddPerson,onAction:()=>j("assigneeId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}}}),O?(0,f.jsx)(l.Action,{title:"Focus Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},onAction:()=>j("estimate"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}}}):null,(0,f.jsx)(l.Action,{title:"Focus Due Date",icon:l.Icon.Calendar,onAction:()=>j("dueDate"),shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}}}),(0,f.jsx)(l.Action,{title:"Focus Labels",icon:l.Icon.Tag,onAction:()=>j("labelIds"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}}}),me?(0,f.jsx)(l.Action,{title:"Focus Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},onAction:()=>j("cycleId"),shortcut:l.Keyboard.Shortcut.Common.Copy}):null,ut?(0,f.jsx)(l.Action,{title:"Focus Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},onAction:()=>j("projectId"),shortcut:{modifiers:["ctrl","shift"],key:"p"}}):null,ds?(0,f.jsx)(l.Action,{title:"Focus Milestone",icon:{source:{light:"light/milestone.svg",dark:"dark/milestone.svg"}},onAction:()=>j("milestoneId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}):null,Nt?(0,f.jsx)(l.Action,{title:"Focus Parent Issue",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}},onAction:()=>j("parentId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}}}):null,(0,f.jsx)(l.Action,{title:"Focus Attachments",icon:l.Icon.NewDocument,onAction:()=>j("attachments"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,f.jsx)(l.Action,{title:"Focus Links",icon:l.Icon.Link,onAction:()=>j("links"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}})]})]}),isLoading:u||S||e.isLoading,children:[(r||d)&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(l.Form.Dropdown,{title:"Team",storeValue:!0,...R.teamId,...r&&{onSearchTextChange:c,isLoading:u,throttle:!0},children:a?.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:$t(m,n)},m.id))}),(0,f.jsx)(l.Form.Separator,{})]}),Z&&(Pe||Ei)?(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(l.Form.Dropdown,{id:"templateId",title:"Template",value:C.templateId||"",onChange:te,isLoading:Pe,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Template",value:"",icon:l.Icon.Document}),le?.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:l.Icon.Document},m.id))]}),(0,f.jsx)(l.Form.Separator,{})]}):null,(0,f.jsx)(l.Form.TextField,{title:"Title",placeholder:"Issue title",...s==="title"?{autoFocus:!0}:{},...R.title}),(0,f.jsx)(l.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",enableMarkdown:!0,...R.description}),(0,f.jsx)(l.Form.Dropdown,{title:"Status",storeValue:!0,...R.stateId,children:Pt?Et.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:z(m)},m.id)):null}),(0,f.jsx)(l.Form.Dropdown,{title:"Priority",storeValue:!0,...R.priority,children:p?e.priorities?.map(({priority:m,label:M})=>(0,f.jsx)(l.Form.Dropdown.Item,{title:M,value:String(m),icon:{source:ue[m]}},m)):null}),(0,f.jsxs)(l.Form.Dropdown,{title:"Assignee",storeValue:!0,...R.assigneeId,...$&&{onSearchTextChange:L,isLoading:S,throttle:!0},children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:l.Icon.Person}),T?.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:_(m)},m.id))]}),(0,f.jsx)(l.Form.TagPicker,{title:"Labels",placeholder:"Add label",...R.labelIds,children:K?D.map(({id:m,name:M,color:we})=>(0,f.jsx)(l.Form.TagPicker.Item,{title:M,value:m,icon:{source:l.Icon.Dot,tintColor:we}},m)):null}),O?(0,f.jsxs)(l.Form.Dropdown,{title:"Estimate",...R.estimate,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),O.map(({estimate:m,label:M})=>(0,f.jsx)(l.Form.Dropdown.Item,{title:M,value:String(m),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},m))]}):null,(0,f.jsx)(l.Form.DatePicker,{title:"Due Date",type:l.Form.DatePicker.Type.Date,...R.dueDate}),me||ut||Nt?(0,f.jsx)(l.Form.Separator,{}):null,me?(0,f.jsxs)(l.Form.Dropdown,{title:"Cycle",storeValue:!0,...R.cycleId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),be(x).map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:m.title,value:m.id,icon:{source:m.icon}},m.id))]}):null,ut?(0,f.jsxs)(l.Form.Dropdown,{title:"Project",storeValue:!0,...R.projectId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),xe.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${m.name} (${m.status.name})`,value:m.id,icon:Y(m)},m.id))]}):null,ds?(0,f.jsxs)(l.Form.Dropdown,{title:"Milestone",storeValue:!0,...R.milestoneId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),je.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${m.name} (${m.targetDate||"No Target Date"})`,value:m.id,icon:Se(m)},m.id))]}):null,Nt?(0,f.jsxs)(l.Form.Dropdown,{title:"Parent",...R.parentId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),B.map(m=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${m.identifier} - ${m.title}`,value:m.id,icon:z(m.state)},m.id))]}):null,(0,f.jsx)(l.Form.Separator,{}),(0,f.jsx)(l.Form.FilePicker,{title:"Attachment",...R.attachments}),(0,f.jsx)(l.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...R.links})]})}var Re=require("react/jsx-runtime");function ss({issue:e,mutateList:t}){let{issues:s,isLoadingIssues:o,mutateList:i}=Ie(u=>xs(u),[e.id]),{priorities:c,isLoadingPriorities:a}=yt(),{me:n,isLoadingMe:r}=Ge();return(0,Re.jsxs)(He.List,{isLoading:o||r||a||r,navigationTitle:`${e.identifier} \u2022 Sub-issues`,children:[(0,Re.jsx)(He.List.EmptyView,{title:"No issues",description:"This issue doesn't have any sub-issues.",actions:(0,Re.jsx)(He.ActionPanel,{children:(0,Re.jsx)(He.Action.Push,{title:"Create Sub-Issue",target:(0,Re.jsx)(ts,{priorities:c,me:n,parentId:e.id,projectId:e.project?.id,cycleId:e.cycle?.id,teamId:e.team.id})})})}),s?.map(u=>(0,Re.jsx)(kt,{issue:u,mutateList:t,mutateSubIssues:i,priorities:c,me:n},u.id))]})}var U=require("@raycast/api");function ki(e){let t=[`Work on Linear issue ${e.identifier}:`,""],s=po(e.branchName);if(s&&t.push(`Suggested branch name: ${s}`,""),t.push(`<issue identifier="${jt(e.identifier)}">`),t.push(`<title>${e.title}</title>`),t.push(...Pi(e.description)),e.team?.name&&t.push(`<team name="${jt(e.team.name)}"/>`),e.labels?.nodes?.forEach(i=>{t.push(`<label>${i.name}</label>`)}),e.project?.name){let i=jt(e.project.name);t.push(e.project.description?`<project name="${i}">${e.project.description}</project>`:`<project name="${i}"/>`)}e.parent&&t.push(...hi("parent-issue",e.parent));let o=e.children?.nodes??[];return o.length>0&&(t.push("<sub-issues>"),o.forEach(i=>t.push(...hi("sub-issue",i))),t.push("</sub-issues>")),t.push("</issue>"),t.join(`
`)}function hi(e,t){return[`<${e} identifier="${jt(t.identifier)}">`,`<id>${t.id}</id>`,`<title>${t.title}</title>`,...Pi(t.description),`</${e}>`]}function Pi(e){return e?e.includes(`
`)?["<description>",e,"</description>"]:[`<description>${e}</description>`]:[]}function po(e){return e&&e.slice(e.lastIndexOf("/")+1)}function jt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var oe=require("react/jsx-runtime"),go={ISSUE_TITLE:"title",ISSUE_ID:"identifier",ISSUE_URL:"url",ISSUE_BRANCH_NAME:"branchName"};function fo(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function Io(e){return e.replace(/\[/g,"\\[").replace(/\]/g,"\\]")}function yo(e){return{html:`<a href="${e.url}">${fo(e.title)}</a>`,text:`[${Io(e.title)}](${e.url})`}}function is({issue:e}){let{issueCustomCopyAction:t}=(0,U.getPreferenceValues)();async function s(){let o=await(0,U.showToast)({style:U.Toast.Style.Animated,title:"Copying prompt"});try{await U.Clipboard.copy(ki(await js(e.id))),o.style=U.Toast.Style.Success,o.title="Copied prompt to clipboard"}catch(i){o.style=U.Toast.Style.Failure,o.title="Failed copying prompt",o.message=W(i)}}return(0,oe.jsxs)(U.ActionPanel.Section,{children:[(0,oe.jsx)(U.Action.CopyToClipboard,{content:e.identifier,title:"Copy Issue ID",shortcut:{macOS:{modifiers:["cmd"],key:"."},Windows:{modifiers:["ctrl"],key:"."}}}),(0,oe.jsx)(U.Action.CopyToClipboard,{content:{html:`<a href="${e.url}" title="${e.title}">${e.identifier}: ${e.title}</a>`,text:e.url},title:"Copy Formatted Issue URL",shortcut:U.Keyboard.Shortcut.Common.CopyPath}),(0,oe.jsx)(U.Action.CopyToClipboard,{content:e.url,title:"Copy Issue URL",shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}}}),(0,oe.jsx)(U.Action.CopyToClipboard,{content:e.title,title:"Copy Issue Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}}),(0,oe.jsx)(U.Action.CopyToClipboard,{content:yo(e),title:"Copy Title as Link",shortcut:{macOS:{modifiers:["cmd","shift"],key:"t"},Windows:{modifiers:["ctrl","shift"],key:"t"}}}),(0,oe.jsx)(U.Action.CopyToClipboard,{content:e.branchName,title:"Copy Git Branch Name",shortcut:U.Keyboard.Shortcut.Common.CopyName}),t&&t!==""?(0,oe.jsx)(U.Action.CopyToClipboard,{content:t?.replace(/\{(.*?)\}/g,(o,i)=>{let c=e[go[i]];return c||o}),title:"Custom Copy",shortcut:{macOS:{modifiers:["cmd","opt"],key:"."},Windows:{modifiers:["ctrl","alt"],key:"."}}}):null,(0,oe.jsx)(U.Action,{icon:U.Icon.Clipboard,title:"Copy as Prompt",onAction:s,shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"p"},Windows:{modifiers:["ctrl","alt","shift"],key:"p"}}})]})}var re=require("@raycast/api"),wi=require("react");var ne=require("react/jsx-runtime");function os({issue:e,updateIssue:t}){let{linearClient:s}=h(),[o,i]=(0,wi.useState)(!1),{cycles:c,isLoadingCycles:a}=Ve(e.team.id,{execute:o}),n=e.cycle?pe(e.cycle):null,r=n?.isActive||!1,u=n?.isNext||!1;async function d(T){let $=e.cycle;t({animatedTitle:"Moving to cycle",payload:{cycleId:T?.id||null},optimisticUpdate(S){return{...S,cycle:T||void 0}},rollbackUpdate(S){return{...S,cycle:$}},successTitle:T?"Moved to cycle":"Removed from cycle",successMessage:T?.title?T.title:"",errorTitle:"Failed to move to cycle"})}async function P(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),$=be(T||[]),S=$.findIndex(C=>C.isActive),R=(S>-1?$[S]:null)?$[S+1]:null;if(R)return d(R)}async function L(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),S=be(T||[]).find(H=>H.isActive);if(S)return d(S)}return(0,ne.jsxs)(ne.Fragment,{children:[(0,ne.jsxs)(re.ActionPanel.Submenu,{title:"Move to Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:re.Keyboard.Shortcut.Common.Copy,onOpen:()=>i(!0),children:[(0,ne.jsx)(re.Action,{title:"No Cycle",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}},onAction:()=>d(null)}),!c&&a?(0,ne.jsx)(re.Action,{title:"Loading\u2026"}):be(c||[]).map(T=>(0,ne.jsx)(re.Action,{autoFocus:T.id===n?.id,title:T.title,icon:{source:T.icon},onAction:()=>d(T)},T.id))]}),r?null:(0,ne.jsx)(re.Action,{title:"Move to Active Cycle",icon:{source:{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}},shortcut:re.Keyboard.Shortcut.Common.Copy,onAction:()=>L()}),u?null:(0,ne.jsx)(re.Action,{title:"Move to Next Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},onAction:()=>P()})]})}var ae=require("@raycast/api"),Ci=require("lodash"),bi=require("react");var ye=require("react/jsx-runtime");function rs({issue:e,updateIssue:t}){let[s,o]=(0,bi.useState)(!1),{labels:i}=qe(e.team.id,{execute:s}),[,c]=(0,Ci.partition)(i||[],r=>e.labels.nodes.map(u=>u.id).includes(r.id));async function a(r){let u=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Adding label",payload:{labelIds:[...u,r.id]},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,r]}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(P=>P.id!==r.id)}}},successTitle:"Added label",successMessage:`Label "${r.name}" added to ${e.identifier}`,errorTitle:"Failed to add label"})}async function n(r){let u=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Remove label",payload:{labelIds:u.filter(d=>d!==r.id)},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(P=>P.id!==r.id)}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,r]}}},successTitle:"Removed label",successMessage:`Label "${r.name}" removed from ${e.identifier}`,errorTitle:"Failed to remove label"})}return(0,ye.jsxs)(ye.Fragment,{children:[(0,ye.jsx)(ae.ActionPanel.Submenu,{title:"Add Label",icon:ae.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},onOpen:()=>o(!0),children:c.map(r=>(0,ye.jsx)(ae.Action,{title:r.name,icon:{source:ae.Icon.Dot,tintColor:r.color},onAction:()=>a(r)},r.id))}),e.labels.nodes.length>0?(0,ye.jsx)(ae.ActionPanel.Submenu,{title:"Remove Label",icon:ae.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},children:e.labels.nodes.map(r=>(0,ye.jsx)(ae.Action,{title:r.name,icon:{source:ae.Icon.Dot,tintColor:r.color},onAction:()=>n(r)},r.id))}):null]})}var De=require("@raycast/api"),Si=require("react");var nt=require("react/jsx-runtime");function ns({issue:e,updateIssue:t}){let[s,o]=(0,Si.useState)(!1),{milestones:i,isLoadingMilestones:c}=We(e.project?.id,{execute:s});async function a(n){let r=e.projectMilestone;t({animatedTitle:"Setting milestone",payload:{projectMilestoneId:n?n.id:null},optimisticUpdate(u){return{...u,milestone:n||void 0}},rollbackUpdate(u){return{...u,milestone:r}},successTitle:n?"Set milestone":`Removed milestone from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set milestone"})}return(0,nt.jsxs)(De.ActionPanel.Submenu,{title:"Set Milestone",icon:{source:"linear-icons/milestone.svg",tintColor:De.Color.PrimaryText},shortcut:{modifiers:["ctrl","shift"],key:"m"},onOpen:()=>o(!0),children:[(0,nt.jsx)(De.Action,{title:"No Milestone",icon:{source:"linear-icons/no-milestone.svg"},onAction:()=>a(null)}),!i&&c?(0,nt.jsx)(De.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,nt.jsx)(De.Action,{autoFocus:n.id===e.projectMilestone?.id,title:`${n.name}  (${n.targetDate||"No Target Date"})`,icon:Se(n),onAction:()=>a(n)},n.id))]})}var at=require("@raycast/api"),Ai=require("react");var he=require("react/jsx-runtime");function as({issue:e,updateIssue:t}){let[s,o]=(0,Ai.useState)(!1),{issues:i,isLoadingIssues:c}=Ie(ot,[],{execute:s}),a=e.parent,n=a?.id,r=!!n;async function u(d){t({animatedTitle:"Setting parent issue",payload:{parentId:d?d.id:null},optimisticUpdate(P){return{...P,parent:d||void 0}},rollbackUpdate(P){return{...P,parent:a}},successTitle:"Set parent issue",successMessage:d?`${d.identifier} set as parent issue`:`Removed parent issue from ${e.identifier}`,errorTitle:"Failed to set parent issue"})}return(0,he.jsxs)(he.Fragment,{children:[(0,he.jsx)(at.ActionPanel.Submenu,{title:r?"Change Parent Issue":"Set Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"i"},onOpen:()=>o(!0),children:!i&&c?(0,he.jsx)(at.Action,{title:"Loading\u2026"}):(i||[]).map(d=>(0,he.jsx)(at.Action,{autoFocus:d.id===n,title:`${d.identifier} - ${d.title}`,icon:z(d.state),onAction:()=>u(d)},d.id))}),r?(0,he.jsx)(at.Action,{title:"Remove Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"k"},Windows:{modifiers:["ctrl","shift"],key:"k"}},onAction:()=>u(null)}):null]})}var lt=require("@raycast/api"),Li=require("react");var ct=require("react/jsx-runtime");function ls({issue:e,updateIssue:t}){let[s,o]=(0,Li.useState)(!1),{projects:i,isLoadingProjects:c}=Qe(e.team.id,{execute:s});async function a(n){let r=e.project;t({animatedTitle:"Setting project",payload:{projectId:n?n.id:null},optimisticUpdate(u){return{...u,project:n||void 0}},rollbackUpdate(u){return{...u,project:r}},successTitle:n?"Set project":`Removed project from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set project"})}return(0,ct.jsxs)(lt.ActionPanel.Submenu,{title:"Set Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"p"},onOpen:()=>o(!0),children:[(0,ct.jsx)(lt.Action,{title:"No Project",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}},onAction:()=>a(null)}),!i&&c?(0,ct.jsx)(lt.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,ct.jsx)(lt.Action,{autoFocus:n.id===e.project?.id,title:`${n.name} (${n.status.name})`,icon:Y(n),onAction:()=>a(n)},n.id))]})}var Ze=require("@raycast/api"),Ti=require("react");var Mt=require("react/jsx-runtime");function cs({issue:e,updateIssue:t}){let[s,o]=(0,Ti.useState)(!1),{states:i,isLoadingStates:c}=fe(e.team.id,{execute:s}),a=tt(i||[]);async function n(r){let u=e.state;t({animatedTitle:"Setting status",payload:{stateId:r.id},optimisticUpdate(d){return{...d,state:r}},rollbackUpdate(d){return{...d,state:u}},successTitle:"Set status",successMessage:`${e.identifier} set to ${r.name}`,errorTitle:"Failed to set status"})}return(0,Mt.jsx)(Ze.ActionPanel.Submenu,{icon:Ze.Icon.Circle,title:"Set Status",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},onOpen:()=>o(!0),children:a.length===0&&c?(0,Mt.jsx)(Ze.Action,{title:"Loading\u2026"}):a.map(r=>(0,Mt.jsx)(Ze.Action,{autoFocus:r.id===e.state.id,title:r.name,icon:z(r),onAction:()=>n(r)},r.id))})}var w=require("react/jsx-runtime");function rt({issue:e,mutateList:t,mutateSubIssues:s,mutateDetail:o,showAttachmentsAction:i,attachments:c,priorities:a,me:n}){let{pop:r}=(0,g.useNavigation)(),{linearClient:u}=h(),d=e.assignee?.id===n?.id,P=it({issueEstimationType:e.team.issueEstimationType,issueEstimationAllowZero:e.team.issueEstimationAllowZero,issueEstimationExtended:e.team.issueEstimationExtended});async function L({animatedTitle:I,payload:D,optimisticUpdate:x,rollbackUpdate:B,successTitle:xe,successMessage:je,errorTitle:Xe}){try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:I});let te=u.updateIssue(e.id,D);await Promise.all([te,t?t(te,{optimisticUpdate(N){if(N)return N.map(O=>O.id===e.id?x(O):O)},rollbackOnError(N){if(N)return N.map(O=>O.id===e.id?B(O):O)}}):Promise.resolve(),s?s(te,{optimisticUpdate(N){if(N)return N.map(O=>O.id===e.id?x(O):O)},rollbackOnError(N){if(N)return N.map(O=>O.id===e.id?B(O):O)}}):Promise.resolve(),o?o(te,{optimisticUpdate(N){return x(N)},rollbackOnError(N){return B(N)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:xe,message:je})}catch(te){await(0,g.showToast)({style:g.Toast.Style.Failure,title:Xe,message:W(te)})}}async function T(){if(await(0,g.confirmAlert)({title:"Delete Issue",message:"Are you sure you want to delete the selected issue?",icon:{source:g.Icon.Trash,tintColor:g.Color.Red}}))try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Deleting issue"});let I=u.deleteIssue(e.id);o&&r(),await Promise.all([I,t?t(I,{optimisticUpdate(D){if(D)return D.filter(x=>x.id!==e.id)}}):Promise.resolve(),s?s(I,{optimisticUpdate(D){if(D)return D.filter(x=>x.id!==e.id)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Issue deleted",message:`"${e.title}" is deleted`})}catch(I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to delete issue",message:W(I)})}}async function $(I){let D=e.priority;L({animatedTitle:"Setting priority",payload:{priority:I.priority},optimisticUpdate(x){return{...x,priority:I.priority}},rollbackUpdate(x){return{...x,priority:D}},successTitle:"Set priority",successMessage:`${e.identifier} priority set to ${I.label}`,errorTitle:"Failed to set priority"})}async function S(I){let D=e.assignee;L({animatedTitle:"Setting assignee",payload:{assigneeId:I.id},optimisticUpdate(x){return{...x,assignee:I}},rollbackUpdate(x){return{...x,assignee:D}},successTitle:"Set assignee",successMessage:`${e.identifier} assigned to ${I.displayName}`,errorTitle:"Failed to set assignee"})}async function H(I){let D=e.assignee;L({animatedTitle:"Setting assignee",payload:{assigneeId:I?I.id:null},optimisticUpdate(x){return{...x,assignee:I||void 0}},rollbackUpdate(x){return{...x,assignee:D}},successTitle:"Set assignee",successMessage:`${e.identifier} ${I?"assigned to":"un-assigned from"} me`,errorTitle:"Failed to set assignee"})}async function R({estimate:I,label:D}){let x=e.estimate;L({animatedTitle:"Setting estimate",payload:{estimate:I},optimisticUpdate(B){return{...B,estimate:I}},rollbackUpdate(B){return{...B,estimate:x}},successTitle:"Set estimate",successMessage:`${e.identifier} estimate set to ${D}`,errorTitle:"Failed to set estimate"})}async function C(I){L({animatedTitle:I?"Setting due date":"Removing due date",payload:{dueDate:I},optimisticUpdate(D){return{...D,dueDate:I}},rollbackUpdate(D){return{...D,dueDate:D.dueDate}},successTitle:I?"Set due date":"Removed due date",successMessage:I?`${e.identifier} due date set to ${(0,us.format)(I,"MM/dd/yyyy")}`:"",errorTitle:"Failed to set due date"})}async function v(I){if(!I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed setting reminder"});return}try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Setting reminder"}),await u.issueReminder(e.id,I),o&&r(),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Reminder set",message:`${e.identifier} reminder set to ${(0,us.format)(I,"MM/dd/yyyy")}`})}catch(D){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to set reminder",message:W(D)})}}function j(){t&&t(),s&&s(),o&&o()}let[J,ve]=(0,$i.useState)(""),{users:Z,supportsUserTypeahead:le,isLoadingUsers:Pe}=Fe(J);return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(Ce,{title:"Open Issue",url:e.url}),(0,w.jsxs)(g.ActionPanel.Section,{children:[(0,w.jsx)(g.Action.Push,{title:"Edit Issue",icon:g.Icon.Pencil,shortcut:g.Keyboard.Shortcut.Common.Edit,target:(0,w.jsx)(Ht,{priorities:a,me:n,issue:e,mutateList:t,mutateSubIssues:s})}),(0,w.jsx)(cs,{issue:e,updateIssue:L}),a&&a.length>0?(0,w.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.LevelMeter,title:"Set Priority",shortcut:{macOS:{modifiers:["cmd","opt"],key:"p"},Windows:{modifiers:["ctrl","alt"],key:"p"}},children:a.map(I=>(0,w.jsx)(g.Action,{autoFocus:I.priority===e.priority,title:I.label,icon:{source:ue[I.priority]},onAction:()=>$(I)},I.priority))}):null,(0,w.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.AddPerson,title:"Assign to",shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}},...le&&{onSearchTextChange:ve,isLoading:Pe,throttle:!0},children:Z?.map(I=>(0,w.jsx)(g.Action,{autoFocus:I.id===e.assignee?.id,title:`${I.displayName} (${I.email})`,icon:_(I),onAction:()=>S(I)},I.id))}),n?(0,w.jsx)(g.Action,{title:d?"Un-Assign from Me":"Assign to Me",icon:_(n),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}},onAction:()=>H(d?null:n)}):null,P?(0,w.jsx)(g.ActionPanel.Submenu,{title:"Set Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}},children:P.map(({estimate:I,label:D})=>(0,w.jsx)(g.Action,{autoFocus:I===e.estimate,title:D,onAction:()=>R({estimate:I,label:D})},I))}):null,(0,w.jsx)(g.Action.PickDate,{title:"Set Due Date",shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}},onChange:C}),(0,w.jsx)(g.Action.PickDate,{title:"Set Reminder",shortcut:{macOS:{modifiers:["cmd","shift"],key:"h"},Windows:{modifiers:["ctrl","shift"],key:"h"}},onChange:v}),(0,w.jsx)(rs,{issue:e,updateIssue:L}),(0,w.jsx)(os,{issue:e,updateIssue:L}),(0,w.jsx)(ls,{issue:e,updateIssue:L}),(0,w.jsx)(ns,{issue:e,updateIssue:L}),(0,w.jsx)(as,{issue:e,updateIssue:L}),(0,w.jsx)(g.Action,{title:"Delete Issue",shortcut:g.Keyboard.Shortcut.Common.Remove,icon:g.Icon.Trash,style:g.Action.Style.Destructive,onAction:()=>T()})]}),(0,w.jsxs)(g.ActionPanel.Section,{children:[(0,w.jsx)(g.Action.Push,{title:"Show Sub-Issues",icon:g.Icon.List,target:(0,w.jsx)(ss,{issue:e,mutateList:t}),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}),(0,w.jsx)(g.Action.Push,{title:"Break Issues into Sub-Issues",icon:g.Icon.Stars,target:(0,w.jsx)(Gt,{issue:e}),shortcut:{macOS:{modifiers:["opt","shift"],key:"m"},Windows:{modifiers:["alt","shift"],key:"m"}}}),i?(0,w.jsx)(g.Action.Push,{title:"Show Issue Links",icon:g.Icon.Link,target:(0,w.jsx)(Kt,{attachments:c??[],issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}}):null,(0,w.jsx)(g.Action.Push,{title:"Add Attachments and Links",icon:g.Icon.NewDocument,target:(0,w.jsx)(xt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,w.jsx)(g.Action.Push,{title:"Add Comment",icon:g.Icon.Plus,target:(0,w.jsx)(Be,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"n"},Windows:{modifiers:["ctrl","alt","shift"],key:"n"}}}),(0,w.jsx)(g.Action.Push,{title:"Show Comments",icon:g.Icon.Bubble,target:(0,w.jsx)(Jt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"c"},Windows:{modifiers:["ctrl","alt","shift"],key:"c"}}})]}),(0,w.jsx)(is,{issue:e}),(0,w.jsx)(g.ActionPanel.Section,{children:(0,w.jsx)(g.Action,{title:"Refresh",icon:g.Icon.ArrowClockwise,shortcut:g.Keyboard.Shortcut.Common.Refresh,onAction:()=>j()})})]})}var Ke=require("react/jsx-runtime");function kt({issue:e,mutateList:t,mutateSubIssues:s,priorities:o,me:i}){let c=[e.identifier,e.state.name,e.priorityLabel];e.assignee&&c.push(e.assignee.email,e.assignee.displayName);let a=new Date(e.updatedAt),n=e.dueDate?new Date(e.dueDate):null,r=e.estimate?{icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},text:Tt({estimate:e.estimate,issueEstimationType:e.team.issueEstimationType})}:null,u=e.cycle?pe(e.cycle):null,d=e.project||null,P=e.labels.nodes.length>0,L=[{date:a,tooltip:`Updated: ${(0,Ut.format)(a,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:n?Lt(n):void 0,text:n?(0,Ut.format)(n,"MMM dd"):void 0,tooltip:n?`Due date: ${(0,Ut.format)(n,"MM/dd/yyyy")}`:void 0},{icon:P?ke.Icon.Tag:void 0,text:P?String(e.labels.nodes.length):void 0,tooltip:P?e.labels.nodes.map(T=>T.name).join(", "):void 0},{icon:d?Y(d):void 0,tooltip:`Project: ${d?d.name:void 0}`},{icon:u?{source:u.icon}:void 0,text:u?String(u.number):void 0,tooltip:u?`Cycle: ${u.title}`:void 0},{icon:r?r.icon:void 0,text:r?r.text:void 0},{icon:z(e.state),tooltip:`Status: ${e.state.name}`},{icon:_(e.assignee),tooltip:e.assignee?`Assignee: ${e.assignee?.displayName} (${e.assignee?.email})`:"Unassigned"}];return(0,Ke.jsx)(ke.List.Item,{title:e.title,icon:{value:{source:ue[e.priority]},tooltip:`Priority: ${e.priorityLabel}`},subtitle:e.identifier,keywords:c,accessories:L,actions:(0,Ke.jsxs)(ke.ActionPanel,{title:e.identifier,children:[(0,Ke.jsx)(ke.Action.Push,{title:"Show Details",icon:ke.Icon.Sidebar,target:(0,Ke.jsx)(ht,{issue:e,mutateList:t,priorities:o,me:i})}),(0,Ke.jsx)(rt,{issue:e,mutateList:t,mutateSubIssues:s,priorities:o,me:i})]})},e.id)}var Di=require("@raycast/utils");async function Ri(e){let{graphQLClient:t}=h();return pt(async s=>t.rawRequest(`
          query($viewId: String!, $cursor: String) {
            customView(id: $viewId) {
              issues(first: 50, after: $cursor) {
                nodes {
                  ${Ee}
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,{viewId:e,cursor:s}),s=>s.data?.customView?.issues?.pageInfo??void 0,(s,o)=>s.concat(o.data?.customView?.issues?.nodes??[]),[],5)}function vi(e){let{data:t,error:s,isLoading:o,mutate:i}=(0,Di.useCachedPromise)(Ri,[e],{execute:!!e});return{issues:t,issuesError:s,isLoadingIssues:o,mutateList:i}}var Ft=require("react/jsx-runtime");function ji({viewId:e,viewName:t}){let{issues:s,issuesError:o,isLoadingIssues:i,mutateList:c}=vi(e),{priorities:a,isLoadingPriorities:n}=yt(),{me:r,isLoadingMe:u}=Ge();(0,xi.useEffect)(()=>{o&&(0,de.showToast)({style:de.Toast.Style.Failure,title:"Failed to load issues",message:o.message})},[o]);let d=s?.length===1?"1 issue":`${s?.length??0} issues`;return(0,Ft.jsx)(de.List,{navigationTitle:t,isLoading:i||n||u,searchBarPlaceholder:"Filter issues",children:(0,Ft.jsx)(de.List.Section,{title:t,subtitle:d,children:s?.map(P=>(0,Ft.jsx)(kt,{issue:P,mutateList:c,priorities:a,me:r},P.id))})})}var ee=require("react/jsx-runtime");function ho(){let{data:e,isLoading:t}=(0,Mi.useCachedPromise)(Is),s=e?.favorites??[],i=`https://linear.app/${e?.organization?.urlKey}`;return(0,ee.jsx)(X.List,{isLoading:t,children:s.map(({id:c,type:a,url:n,customView:r,cycle:u,document:d,issue:P,label:L,project:T,initiative:$,user:S,updatedAt:H})=>{let R=null,C=null,v=null;if(a==="customView"&&r&&(R={icon:ge({icon:r.icon??void 0,color:r.color??void 0,fallbackIcon:X.Icon.Layers}),title:r.name},v=(0,ee.jsxs)(X.ActionPanel,{children:[(0,ee.jsx)(X.Action.Push,{title:"Show Issues",icon:X.Icon.List,target:(0,ee.jsx)(ji,{viewId:r.id,viewName:r.name})}),(0,ee.jsx)(Ce,{title:"Open View in Linear",url:i+`/view/${r.id}`})]})),a==="cycle"&&u){let j=pe(u);R={icon:{source:j.icon},title:j.title},C={title:"Open Cycle",url:i+`/team/${u.team.key}/cycle/${u.number}`}}if(a==="document"&&d&&(R={icon:{source:X.Icon.Document,tintColor:d.color},title:d.title},C={title:"Open Document",url:i+`/document/${d.id}`}),a==="issue"&&P&&(R={icon:z(P.state),title:P.title},C={title:"Open Issue",url:P.url}),a==="label"&&L&&(R={icon:{source:X.Icon.Dot,tintColor:L.color},title:L.name},C=Ps(n)),a==="project"&&T&&(R={icon:Y(T),title:T.name},C={title:"Open Project",url:T.url}),a==="initiative"&&$&&(R={icon:Ss($),title:$.name},C={title:"Open Initiative",url:i+`/initiative/${$.id}`}),a==="user"&&S&&(R={icon:_(S),title:S.name},C={title:"Open User",url:S.url}),R){let j=new Date(H),J=v||(C?(0,ee.jsx)(X.ActionPanel,{children:(0,ee.jsx)(Ce,{...C})}):void 0);return(0,ee.jsx)(X.List.Item,{...R,...J?{actions:J}:{},accessories:[{date:j,tooltip:`Updated: ${(0,Ui.format)(j,"EEEE d MMMM yyyy 'at' HH:mm")}`}]},c)}})})}function Fi(){return(0,ee.jsx)(bt,{children:(0,ee.jsx)(ho,{})})}
