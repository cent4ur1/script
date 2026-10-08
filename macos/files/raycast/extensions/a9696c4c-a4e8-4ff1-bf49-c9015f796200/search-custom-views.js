"use strict";var ji=Object.create;var Pt=Object.defineProperty;var Mi=Object.getOwnPropertyDescriptor;var Ui=Object.getOwnPropertyNames;var Fi=Object.getPrototypeOf,Ei=Object.prototype.hasOwnProperty;var Ni=(e,t)=>{for(var s in t)Pt(e,s,{get:t[s],enumerable:!0})},ms=(e,t,s,o)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of Ui(t))!Ei.call(e,i)&&i!==s&&Pt(e,i,{get:()=>t[i],enumerable:!(o=Mi(t,i))||o.enumerable});return e};var ut=(e,t,s)=>(s=e!=null?ji(Fi(e)):{},ms(t||!e||!e.__esModule?Pt(s,"default",{value:e,enumerable:!0}):s,e)),Vi=e=>ms(Pt({},"__esModule",{value:!0}),e);var go={};Ni(go,{CustomViewIssues:()=>Di,default:()=>xi});module.exports=Vi(go);var B=require("@raycast/api"),us=require("react");var Ie=require("@raycast/api"),vt=require("date-fns");var ae=require("date-fns"),Oi=10080*60*1e3;function ve(e){let t=Date.now(),s=Date.now()+Oi,o=new Date(e.startsAt),i=new Date(e.endsAt),c=!e.completedAt&&(0,ae.isBefore)(o,t)&&(0,ae.isAfter)(i,t),l=!e.completedAt&&(0,ae.isBefore)(o,s)&&(0,ae.isAfter)(i,s),n=c?{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}:{light:"light/cycle.svg",dark:"dark/cycle.svg"},r=`Cycle ${e.number} (${(0,ae.format)(o,"dd MMM")} - ${(0,ae.format)(i,"dd MMM")})`,u=c?`Active ${r}`:r;return{...e,isActive:c,isNext:l,icon:n,title:u}}function ke(e){return e.filter(t=>(0,ae.isAfter)(new Date(t.endsAt),Date.now())).map(ve)}var Ke=require("@raycast/api"),wt=require("date-fns");function Ct(e){let t=(0,wt.differenceInDays)(e,(0,wt.startOfToday)()),s=Ke.Color.PrimaryText;return t<=7&&(s=Ke.Color.Orange),t<=0&&(s=Ke.Color.Red),{source:Ke.Icon.Calendar,tintColor:s}}var ps={exponential:[0,1,2,4,8,16,32,64],fibonacci:[0,1,2,3,5,8,13,21],linear:[0,1,2,3,4,5,6,7],tShirt:[0,1,2,3,5,8,13,21]},gs={0:"\u2013",1:"XS",2:"S",3:"M",5:"L",8:"XL",13:"XXL",21:"XXXL"};function St({estimate:e,issueEstimationType:t}){if(!e)return"Not estimated";if(t==="tShirt"){let s=gs[e];return s||String(e)}return String(e)}function Xe({issueEstimationType:e,issueEstimationAllowZero:t,issueEstimationExtended:s}){if(e==="notUsed")return null;let o=t?0:1,i=s?ps[e].length:6,c=ps[e].slice(o,i);return e==="tShirt"?c.map(l=>({estimate:l,label:gs[l]})):c.map(l=>({estimate:l,label:l!==1?`${l} points`:`${l} point`}))}var le={0:{light:"light/priority-no-priority.svg",dark:"dark/priority-no-priority.svg"},1:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"},2:{light:"light/priority-high.svg",dark:"dark/priority-high.svg"},3:{light:"light/priority-medium.svg",dark:"dark/priority-medium.svg"},4:{light:"light/priority-low.svg",dark:"dark/priority-low.svg"}};var fs=ut(require("fs")),Is=require("@raycast/api"),ys=ut(require("node-emoji"));function Je({icon:e,color:t,fallbackIcon:s}){if(!e)return s;if(/:(.*):/.test(e))return ys.get(e)??s;let i=`${Is.environment.assetsPath}/linear-icons/${e.toLowerCase()}.svg`;return fs.default.existsSync(i)?{source:i,...t?{tintColor:{light:t,dark:t,adjustContrast:!0}}:{}}:s}function ce(e){return e?Je({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var hs=require("lodash");var qi={triage:{light:"light/triage.svg",dark:"dark/triage.svg"},backlog:{light:"light/backlog.svg",dark:"dark/backlog.svg"},unstarted:{light:"light/unstarted.svg",dark:"dark/unstarted.svg"},started:{light:"light/started.svg",dark:"dark/started.svg"},completed:{light:"light/completed.svg",dark:"dark/completed.svg"},canceled:{light:"light/canceled.svg",dark:"dark/canceled.svg"}};function _(e){return{source:qi[e.type],tintColor:{light:e.color,dark:e.color,adjustContrast:!0}}}function Ye(e,t=["triage","backlog","unstarted","started","completed","canceled"]){if(e.length===0)return[];let s=(0,hs.groupBy)(e,o=>o.type);return t.filter(o=>!!s[o]).map(o=>s[o]).flat()}var bt=require("@raycast/api"),ks=require("@raycast/utils");function K(e){return e?{source:e.avatarUrl?encodeURI(e.avatarUrl):(0,ks.getAvatarIcon)(e.displayName.toUpperCase()),mask:bt.Image.Mask.Circle}:bt.Icon.Person}var g=require("@raycast/api"),ns=require("date-fns"),bi=require("react");var Ps=require("@linear/sdk"),ws=require("@raycast/api"),Cs=require("@raycast/utils"),dt=null;async function Wi(e,t,s,o,i){let c=JSON.stringify({query:s,variables:o}),l=new Headers(t.headers);new Headers(i).forEach((u,d)=>l.set(d,u)),l.set("Content-Type","application/json");let n=await fetch(e,{...t,method:"POST",headers:Object.fromEntries(l.entries()),body:c}),r=n.headers.get("Content-Type")?.startsWith("application/json")?await n.json():await n.text();if(typeof r!="string"&&n.ok&&!r.errors&&r.data)return{...r,headers:n.headers,status:n.status};throw new Error(typeof r=="string"?r:r.errors?.[0]?.message??`GraphQL Error (${n.status})`)}var Nt=Cs.OAuthService.linear({scope:"read write",onAuthorize({token:e}){dt=new Ps.LinearClient({accessToken:e,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":ws.environment.extensionName}});let t=dt.client;t.rawRequest=((s,o,i)=>Wi(t.url,t.options,s,o,i))}});function k(){if(!dt)throw new Error("No linear client initialized");return{linearClient:dt,graphQLClient:dt.client}}function q(e){return e instanceof Error?e.message:String(e)}var Ss=require("@raycast/utils");function je(e=""){let{linearClient:t}=k(),{data:s,error:o,isLoading:i}=(0,Ss.useCachedPromise)(async c=>{let l=await t.users(c.trim().length>0?{filter:{name:{containsIgnoreCase:c}}}:void 0);return{users:l?.nodes??[],hasMoreUsers:!!l?.pageInfo?.hasNextPage}},[e],{initialData:[]});return{users:s?.users,supportsUserTypeahead:e.trim().length>0||s?.hasMoreUsers,usersError:o,isLoadingUsers:!s&&!o||i}}var S=require("@raycast/api"),Ms=require("@raycast/utils"),Us=require("nanoid"),Fe=require("react");var bs=require("@raycast/api");async function et(e,t,s,o,i){let c=o,l=!0,n,r=0;for(;l&&r<i;){let u=await e(n);c=s(c,u),l=t(u)?.hasNextPage,n=t(u)?.endCursor,r++}return c}var Qi=(0,bs.getPreferenceValues)();function As({inFilterBlock:e,addComma:t,inParentheses:s}={inFilterBlock:!1,inParentheses:!1,addComma:!0}){return Qi.shouldHideRedundantIssues?[...s?["("]:[],...t?[", "]:[],...e?[]:["filter: { "],"completedAt: { null: true }, canceledAt: { null: true }",...e?[]:[" }"],...s?[")"]:[]].join(""):""}var Me=`
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
`;async function tt(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        issues(orderBy: createdAt${As()}) {
          nodes {
            ${Me}
          }
        }
      }
    `);return t?.issues.nodes}async function Ls(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          children${As({inParentheses:!0})} {
            nodes {
              ${Me}
              sortOrder
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.children.nodes}async function Ts(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
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
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}async function $s(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
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
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.comments.nodes}async function Rs(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          ${Me}
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
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}async function Ds(e){let{graphQLClient:t}=k(),s=e.title.replace(/"/g,"\\$&"),o=e.description?.replace(/\n/g,"\\n")?.replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${o}", priority: ${e.priority}`;e.stateId&&(i+=`, stateId: "${e.stateId}"`),e.estimate&&(i+=`, estimate: ${e.estimate}`),e.assigneeId&&(i+=`, assigneeId: "${e.assigneeId}"`),e.labelIds&&e.labelIds.length>0&&(i+=`, labelIds: [${e.labelIds.map(l=>`"${l}"`).join(",")}]`),e.dueDate&&(i+=`, dueDate: "${e.dueDate.toISOString()}"`),e.cycleId&&(i+=`, cycleId: "${e.cycleId}"`),e.projectId&&(i+=`, projectId: "${e.projectId}"`),e.projectId&&e.projectMilestoneId&&(i+=`, projectMilestoneId: "${e.projectMilestoneId}"`),e.parentId&&(i+=`, parentId: "${e.parentId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
          issue {
            ${Me}
          }
        }
      }
    `);return{success:c?.issueCreate.success,issue:c?.issueCreate.issue}}async function xs(e){let{graphQLClient:t}=k(),s=e.title.replace(/"/g,"\\$&"),o=e.description?.replace(/\n/g,"\\n").replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${o}", parentId: "${e.parentId}"`;e.stateId&&(i+=`, stateId: "${e.stateId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
        }
      }
    `);return{success:c?.issueCreate.success}}var vs=require("@raycast/utils");function Ue(e){let t=e.id,{data:s,error:o,isLoading:i,mutate:c}=(0,vs.useCachedPromise)(Rs,[t],{initialData:{...e,description:""}});return{issue:s,issueError:o,isLoadingIssue:i,mutateDetail:c}}var js=require("@raycast/utils");function me(e,t){let{linearClient:s}=k(),{data:o,error:i,isLoading:c}=(0,js.useCachedPromise)(async l=>(await s.workflowStates({filter:{team:{id:{eq:l}}}})).nodes.sort((r,u)=>r.position-u.position),[e],{initialData:[],execute:t?.execute!==!1});return{states:o,isLoadingStates:c,statesError:i}}var Y=require("react/jsx-runtime");function Vt({issue:e}){let{pop:t}=(0,S.useNavigation)(),{states:s}=me(e.team.id),o=(0,Fe.useMemo)(()=>s.filter(b=>b.type==="unstarted")[0],[s]),{issue:i,isLoadingIssue:c}=Ue(e),{data:l,isLoading:n,revalidate:r}=(0,Ms.useAI)(`Act as a product manager for Linear issues. Break down a Linear issue into a list of sub-issues. 
    
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

Break down the Linear issue with this title: "${i.title}"`,{execute:!!i&&!c,creativity:.5}),[u,d]=(0,Fe.useState)(!1),[P,L]=(0,Fe.useState)([]);(0,Fe.useEffect)(()=>{if(!(!l||n)){try{let $=/\[[\s\S]*?\]/,b=l.match($);if(b&&b[0]){let X=JSON.parse(b[0]);L(X.map(U=>({...U,id:(0,Us.nanoid)(),selected:!0})))}}catch($){(0,S.showToast)({style:S.Toast.Style.Failure,title:"Failed to parse AI results",message:q($),primaryAction:{title:"Retry",onAction:r},secondaryAction:{title:"Copy AI Result",onAction:()=>S.Clipboard.copy(l)}})}d(!0)}},[l,n]);async function T(){try{await(0,S.showToast)({style:S.Toast.Style.Animated,title:"Creating sub-issues"});let $=P.filter(b=>b.selected);await Promise.all($.map(b=>xs({teamId:i.team.id,title:b.title,description:b.description,parentId:i.id,stateId:o?.id}))),await(0,S.showToast)({style:S.Toast.Style.Success,title:"Created sub-issues"}),t()}catch($){(0,S.showToast)({style:S.Toast.Style.Failure,title:"Failed to create Sub-Issues",message:q($)})}}return(0,Y.jsxs)(S.List,{isLoading:n||!u,children:[P?.map($=>(0,Y.jsx)(S.List.Item,{icon:$.selected?{source:S.Icon.CheckCircle,tintColor:S.Color.Green}:S.Icon.Circle,title:$.title,subtitle:$.description,actions:(0,Y.jsxs)(S.ActionPanel,{children:[(0,Y.jsx)(S.Action,{title:$.selected?"Unselect Sub-Issue":"Select Sub-Issue",icon:$.selected?S.Icon.Circle:{source:S.Icon.CheckCircle,tintColor:S.Color.Green},onAction:()=>L(P.map(b=>b.id===$.id?{...b,selected:!b.selected}:b))}),(0,Y.jsx)(S.Action,{title:"Create Sub-Issues",icon:S.Icon.Plus,onAction:()=>T()}),(0,Y.jsx)(S.Action,{title:"Generate New Sub-Issues",icon:S.Icon.ArrowClockwise,onAction:r})]})},$.title)),(0,Y.jsx)(S.List.EmptyView,{title:"No sub-issues were generated. Try again.",actions:(0,Y.jsx)(S.ActionPanel,{children:(0,Y.jsx)(S.Action,{title:"Retry",icon:S.Icon.ArrowClockwise,onAction:r})})})]})}var y=require("@raycast/api"),qe=require("@raycast/utils"),pt=require("react");async function Fs(e,t){let{graphQLClient:s}=k(),o=[];if(t.teamId&&o.push(`teamId: "${t.teamId}"`),t.title&&o.push(`title: "${t.title.replace(/"/g,"\\$&")}"`),t.description&&o.push(`description: "${t.description.replace(/\n/g,"\\n").replace(/"/g,"\\$&")}"`),t.stateId&&o.push(`stateId: "${t.stateId}"`),typeof t.priority<"u"&&o.push(`priority: ${t.priority}`),typeof t.assigneeId<"u"&&o.push(`assigneeId: ${t.assigneeId?`"${t.assigneeId}"`:null}`),t.labelIds&&o.push(`labelIds: [${t.labelIds.map(c=>`"${c}"`).join(",")}]`),typeof t.estimate<"u"&&o.push(`estimate: ${t.estimate}`),typeof t.dueDate<"u"){let c=t.dueDate?t.dueDate instanceof Date?t.dueDate.toISOString():t.dueDate:null;o.push(`dueDate: ${c?`"${c}"`:null}`)}typeof t.cycleId<"u"&&o.push(`cycleId: ${t.cycleId?`"${t.cycleId}"`:null}`),typeof t.projectId<"u"&&o.push(`projectId: ${t.projectId?`"${t.projectId}"`:null}`),typeof t.projectMilestoneId<"u"&&o.push(`projectMilestoneId: ${t.projectMilestoneId?`"${t.projectMilestoneId}"`:null}`),typeof t.parentId<"u"&&o.push(`parentId: ${t.parentId?`"${t.parentId}"`:null}`);let{data:i}=await s.rawRequest(`
      mutation {
        issueUpdate(id: "${e}", input: {${o.join(", ")}}) {
          success
        }
      }
    `);return{success:i?.issueUpdate.success}}var Ot=require("@raycast/api");function Pe(e){return e?{source:"linear-icons/milestone.svg",tintColor:Ot.Color.PrimaryText}:{source:"linear-icons/no-milestone.svg",tintColor:Ot.Color.SecondaryText}}var Es=require("@raycast/api");function At(e,t){let s=t?.logoUrl?encodeURI(t.logoUrl):Es.Icon.TwoPeople;return Je({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:s})}var Ns=require("@raycast/utils");function Ee(e,t){let{linearClient:s}=k(),{data:o,error:i,isLoading:c}=(0,Ns.useCachedPromise)(async l=>(await s.cycles({filter:{team:{id:{eq:l}}}})).nodes.sort((r,u)=>r.number-u.number),[e],{execute:t?.execute!==!1&&!!e});return{cycles:o,cyclesError:i,isLoadingCycles:!o&&!i||c}}var Vs=require("@raycast/utils");function pe(e,t=[],s){let{data:o,error:i,isLoading:c,mutate:l}=(0,Vs.useCachedPromise)(e,t,s);return{issues:o,issuesError:i,isLoadingIssues:c,mutateList:l}}var Ws=require("@raycast/utils");var Os=require("@raycast/api");var Bi=100,zi=100,Gi=(0,Os.getPreferenceValues)();function _i(){let e=Number(Gi.labelsLimit),t=Number.isFinite(e)&&e>0?e:zi,s=Math.floor(Math.min(Bi,t)),o=Math.ceil(t/s);return{pageSize:s,pageLimit:o}}async function qs(e){if(!e)return[];let{pageSize:t,pageLimit:s}=_i(),{graphQLClient:o}=k();return et(async i=>o.rawRequest(`
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
        `,{teamId:e,cursor:i}),i=>i.data?.team?.labels?.pageInfo,(i,c)=>i.concat(c.data?.team?.labels?.nodes??[]),[],s)}function Ne(e,t){let{data:s,error:o,isLoading:i}=(0,Ws.useCachedPromise)(qs,[e],{execute:t?.execute!==!1&&!!e});return{labels:s,labelsError:o,isLoadingLabels:!s&&!o||i}}var Bs=require("@raycast/utils");var Zi=`
  id
  name
  targetDate
  project {
      id
  }
  sortOrder
  updatedAt
`;async function Qs(e){let{graphQLClient:t}=k();if(e){let{data:s}=await t.rawRequest(`
        query($projectId: String!) {
          project(id: $projectId) {
            projectMilestones {
              nodes {
                ${Zi}
              }
            }
          }
        }
      `,{projectId:e});return s?.project.projectMilestones.nodes}return null}function Ve(e,t){let{data:s,error:o,isLoading:i,mutate:c}=(0,Bs.useCachedPromise)(Qs,[e],{execute:t?.execute!==!1});return{milestones:s,isLoadingMilestones:!s&&!o||i,milestonesError:o,mutateMilestones:c}}var Gs=require("@raycast/utils");var Hi=`
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
`;async function zs({teamId:e,searchText:t="",after:s=null,first:o=null}){let{graphQLClient:i}=k(),c=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${Hi}
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
      `,{first:o,after:s,searchText:t}),u=r?.projects;return{data:u?.nodes??[],hasMore:!!u?.pageInfo.hasNextPage,cursor:u?.pageInfo.endCursor||null}}let{data:l}=await i.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${c}
        }
      }
    `,{teamId:e,first:o,after:s,searchText:t}),n=l?.team?.projects;return{data:n?.nodes??[],hasMore:!!n?.pageInfo.hasNextPage,cursor:n?.pageInfo.endCursor||null}}function Oe(e,t){let{data:s,error:o,isLoading:i,mutate:c,pagination:l}=(0,Gs.useCachedPromise)((n,r)=>u=>zs({teamId:n,searchText:r,after:u.cursor,first:t?.pageSize}),[e,t?.searchText],{execute:t?.execute!==!1,keepPreviousData:!0});return{projects:s,isLoadingProjects:!s&&!o||i,projectsError:o,mutateProjects:c,pagination:l}}var Hs=require("@raycast/utils");var _s=require("lodash");async function Zs(e=""){let{graphQLClient:t,linearClient:s}=k(),o=await s.viewer,{data:i}=await t.rawRequest(`
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
    `,{userId:o.id,query:e}),c=(0,_s.sortBy)(i?.teams.nodes??[],r=>r.membership?.sortOrder??1/0),l=i?.organization,n=!!i?.teams.pageInfo.hasNextPage;return{teams:c,organization:l,hasMoreTeams:n}}function mt(e=""){let{data:t,error:s,isLoading:o}=(0,Hs.useCachedPromise)(Zs,[e]);return{teams:t?.teams,org:t?.organization,teamsError:s,isLoadingTeams:!t&&!s||o,supportsTeamTypeahead:e.trim().length>0||t?.hasMoreTeams}}var C=require("react/jsx-runtime");function qt(e){let{pop:t}=(0,y.useNavigation)(),{issue:s,isLoadingIssue:o,mutateDetail:i}=Ue(e.issue),[c,l]=(0,pt.useState)(""),{teams:n,org:r,supportsTeamTypeahead:u,isLoadingTeams:d}=mt(c),P=n&&n.length>1,[L,T]=(0,pt.useState)(""),{users:$,supportsUserTypeahead:b,isLoadingUsers:X}=je(L),{handleSubmit:U,itemProps:R,values:v,setValue:W}=(0,qe.useForm)({async onSubmit(p){let H=await(0,y.showToast)({style:y.Toast.Style.Animated,title:"Editing issue"});try{let de={teamId:p.teamId||e.issue.team.id,title:p.title,description:p.description,stateId:p.stateId,labelIds:p.labelIds,dueDate:p.dueDate,...z&&p.estimate?{estimate:parseInt(p.estimate)}:{},...p.assigneeId?{assigneeId:p.assigneeId}:{},...p.cycleId?{cycleId:p.cycleId}:{},...p.projectId?{projectId:p.projectId}:{},...p.milestoneId?{projectMilestoneId:p.milestoneId}:{},...p.parentId?{parentId:p.parentId}:{},priority:parseInt(p.priority)},{success:ct}=await Fs(s.id,de);ct&&(H.style=y.Toast.Style.Success,H.title=`Edited Issue \u2022 ${s.identifier}`,t(),i(),e.mutateList&&e.mutateList(),e.mutateSubIssues&&e.mutateSubIssues())}catch(de){H.style=y.Toast.Style.Failure,H.title="Failed to edit issue",H.message=q(de)}},validation:{teamId:P?qe.FormValidation.Required:void 0,title:qe.FormValidation.Required,stateId:qe.FormValidation.Required,priority:qe.FormValidation.Required},initialValues:{teamId:e.issue.team.id,title:e.issue.title,description:s.description??void 0,priority:String(e.issue.priority),stateId:e.issue.state.id,estimate:e.issue.estimate?String(e.issue.estimate):void 0,assigneeId:e.issue.assignee?.id,labelIds:e.issue.labels.nodes.map(p=>p.id),dueDate:s.dueDate?new Date(s.dueDate):null,cycleId:e.issue.cycle?.id,projectId:e.issue.project?.id,milestoneId:e.issue.projectMilestone?.id,parentId:e.issue.parent?.id}});(0,pt.useEffect)(()=>{W("description",s.description||""),W("dueDate",s.dueDate?new Date(s.dueDate):null)},[s]);let ue=!!v.teamId&&v.teamId.trim().length>0,{states:Te}=me(v.teamId,{execute:ue}),{labels:Z}=Ne(v.teamId,{execute:ue}),{cycles:ne}=Ee(v.teamId,{execute:ue}),{issues:ye}=pe(tt,[],{execute:ue}),{projects:I}=Oe(v.teamId,{execute:ue}),{milestones:A}=Ve(v.projectId,{execute:!!v.projectId}),D=n?.find(p=>p.id===v.teamId),z=D?Xe({issueEstimationType:D.issueEstimationType,issueEstimationAllowZero:D.issueEstimationAllowZero,issueEstimationExtended:D.issueEstimationExtended}):null,$e=Ye(Te||[]),Re=Te&&Te.length>0,Ze=e.priorities&&e.priorities.length>0,J=Z&&Z.length>0,E=ne&&ne.length>0,N=I&&I.length>0,Mt=A&&A.length>0,kt=ye&&ye.length>0;return(0,C.jsxs)(y.Form,{actions:(0,C.jsx)(y.ActionPanel,{children:(0,C.jsx)(y.Action.SubmitForm,{onSubmit:U,title:"Edit Issue"})}),isLoading:d||o||X,children:[(u||P)&&(0,C.jsxs)(C.Fragment,{children:[(0,C.jsx)(y.Form.Dropdown,{title:"Team",...R.teamId,...u&&{onSearchTextChange:l,isLoading:d,throttle:!0},children:n?.map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:At(p,r)},p.id))}),(0,C.jsx)(y.Form.Separator,{})]}),(0,C.jsx)(y.Form.TextField,{title:"Title",placeholder:"Issue title",autoFocus:!0,...R.title}),(0,C.jsx)(y.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...R.description}),(0,C.jsx)(y.Form.Dropdown,{title:"Status",...R.stateId,children:Re?$e.map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:_(p)},p.id)):null}),(0,C.jsx)(y.Form.Dropdown,{title:"Priority",...R.priority,children:Ze?e.priorities?.map(({priority:p,label:H})=>(0,C.jsx)(y.Form.Dropdown.Item,{title:H,value:String(p),icon:{source:le[p]}},p)):null}),(0,C.jsxs)(y.Form.Dropdown,{title:"Assignee",...R.assigneeId,...b&&{onSearchTextChange:T,isLoading:X,throttle:!0},children:[(0,C.jsx)(y.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:y.Icon.Person}),$?.map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:K(p)},p.id))]}),(0,C.jsx)(y.Form.TagPicker,{title:"Labels",...R.labelIds,placeholder:"Add label",children:J?Z.map(({id:p,name:H,color:de})=>(0,C.jsx)(y.Form.TagPicker.Item,{title:H,value:p,icon:{source:y.Icon.Dot,tintColor:de}},p)):null}),z?(0,C.jsxs)(y.Form.Dropdown,{title:"Estimate",...R.estimate,children:[(0,C.jsx)(y.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),z.map(({estimate:p,label:H})=>(0,C.jsx)(y.Form.Dropdown.Item,{title:H,value:String(p),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},p))]}):null,(0,C.jsx)(y.Form.DatePicker,{title:"Due Date",type:y.Form.DatePicker.Type.Date,...R.dueDate}),E||N||kt?(0,C.jsx)(y.Form.Separator,{}):null,E?(0,C.jsxs)(y.Form.Dropdown,{title:"Cycle",...R.cycleId,children:[(0,C.jsx)(y.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),ke(ne).map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:p.title,value:p.id,icon:{source:p.icon}},p.id))]}):null,N?(0,C.jsxs)(y.Form.Dropdown,{title:"Project",...R.projectId,children:[(0,C.jsx)(y.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),I.map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:`${p.name} (${p.status.name})`,value:p.id,icon:ce(p)},p.id))]}):null,Mt?(0,C.jsxs)(y.Form.Dropdown,{title:"Milestone",storeValue:!0,...R.milestoneId,children:[(0,C.jsx)(y.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),A.map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:`${p.name}  (${p.targetDate||"No Target Date"})`,value:p.id,icon:Pe(p)},p.id))]}):null,kt?(0,C.jsxs)(y.Form.Dropdown,{title:"Parent",...R.parentId,children:[(0,C.jsx)(y.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),ye.map(p=>(0,C.jsx)(y.Form.Dropdown.Item,{title:`${p.identifier} - ${p.title}`,value:p.id,icon:_(p.state)},p.id))]}):null]})}var ee=require("@raycast/api"),Js=require("date-fns");var V=require("@raycast/api"),Xs=require("@raycast/utils");var Ks=require("fs/promises"),Wt=ut(require("path"));var Ki="application/octet-stream",Xi={".apng":"image/apng",".avif":"image/avif",".bmp":"image/bmp",".csv":"text/csv",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",".gif":"image/gif",".gz":"application/gzip",".heic":"image/heic",".heif":"image/heif",".ico":"image/x-icon",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json",".md":"text/markdown",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".pdf":"application/pdf",".png":"image/png",".ppt":"application/vnd.ms-powerpoint",".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",".svg":"image/svg+xml",".tar":"application/x-tar",".tif":"image/tiff",".tiff":"image/tiff",".txt":"text/plain",".webm":"video/webm",".webp":"image/webp",".xls":"application/vnd.ms-excel",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".zip":"application/zip"};function Ji(e){return Xi[Wt.default.extname(e).toLowerCase()]??Ki}async function Yi(e){let{graphQLClient:t}=k(),s=await(0,Ks.readFile)(e),o=Ji(e),i=Wt.default.basename(e),{data:c}=await t.rawRequest(`
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
    `,{size:s.byteLength,contentType:o,filename:i}),l=c?.fileUpload.uploadFile;if(!c?.fileUpload.success||!l)throw new Error(`Failed to request an upload URL for "${i}"`);let n=new Headers({"Content-Type":o,"Cache-Control":"public, max-age=31536000"});l.headers.forEach(({key:u,value:d})=>n.set(u,d));let r=await fetch(l.uploadUrl,{method:"PUT",headers:n,body:s});if(!r.ok)throw new Error(`Failed to upload "${i}": ${r.status} ${r.statusText}`);return{assetUrl:l.assetUrl,contentType:o,name:i}}async function Lt(e){let{linearClient:t}=k(),s=await Yi(e.url),o=await t.createAttachment({issueId:e.issueId,title:s.name,url:s.assetUrl});return{success:o.success,id:o.attachmentId}}async function Tt(e){let{linearClient:t}=k(),s=await t.attachmentLinkURL(e.issueId,e.url);return{success:s.success,id:s.attachmentId}}function $t(e){let t=e.split(`
`),s=/https?:\/\/\S+/,o=t.map(i=>i.trim()).filter(i=>s.test(i));return Array.from(new Set(o))}var we=require("react/jsx-runtime");function Rt({issue:{id:e,title:t,identifier:s}}){let{pop:o}=(0,V.useNavigation)(),{reset:i,itemProps:c,handleSubmit:l}=(0,Xs.useForm)({onSubmit:async n=>{let r=await(0,V.showToast)({style:V.Toast.Style.Animated,title:"Attaching links"}),u=$t(n.links);if(u.length===0&&n.attachments.length===0){r.style=V.Toast.Style.Failure,r.title="No links or attachments provided";return}if(u.length>0){let d=u.length===1?"link":"links";try{await Promise.all(u.map(P=>Tt({issueId:e,url:P}))),r.style=V.Toast.Style.Success,r.title=`Successfully attached ${d}`}catch(P){r.style=V.Toast.Style.Failure,r.title=`Failed attaching ${d}`,r.message=q(P)}}if(n.attachments.length>0){let d=n.attachments.length===1?"attachment":"attachments";try{r.style=V.Toast.Style.Animated,r.title=`Uploading ${d}\u2026`,await Promise.all(n.attachments.map(P=>Lt({issueId:e,url:P}))),r.style=V.Toast.Style.Success,r.title=`Successfully uploaded ${d}`}catch(P){r.style=V.Toast.Style.Failure,r.title=`Failed uploading ${d}`,r.message=q(P)}}i({attachments:[],links:""}),o()},initialValues:{links:""}});return(0,we.jsxs)(V.Form,{actions:(0,we.jsx)(V.ActionPanel,{children:(0,we.jsx)(V.Action.SubmitForm,{onSubmit:l,icon:V.Icon.NewDocument,title:"Attach"})}),navigationTitle:"Add Attachments and Links",children:[(0,we.jsx)(V.Form.Description,{title:"Issue",text:`[${s}] ${t}`}),(0,we.jsx)(V.Form.FilePicker,{title:"Attachment",...c.attachments}),(0,we.jsx)(V.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...c.links})]})}var Ce=require("react/jsx-runtime");function Qt({attachments:e,issue:t}){return(0,Ce.jsx)(ee.List,{navigationTitle:`Links for ${t.identifier}`,children:e.map(s=>{let o=new Date(s.updatedAt);return(0,Ce.jsx)(ee.List.Item,{icon:s.source?.imageUrl??ee.Icon.Link,title:s.title,subtitle:s.subtitle,accessories:[{date:o,tooltip:`Updated: ${(0,Js.format)(o,"EEEE d MMMM yyyy 'at' HH:mm")}`}],actions:(0,Ce.jsxs)(ee.ActionPanel,{children:[(0,Ce.jsx)(ee.Action.OpenInBrowser,{url:s.url}),(0,Ce.jsx)(ee.Action.Push,{title:"Add Attachments and Links",icon:ee.Icon.NewDocument,target:(0,Ce.jsx)(Rt,{issue:t})})]})},s.id)})})}var Q=require("@raycast/api"),Ys=require("react");var gt=require("react/jsx-runtime");function We({comment:e,issue:t,mutateComments:s}){let{linearClient:o}=k(),{pop:i}=(0,Q.useNavigation)(),[c,l]=(0,Ys.useState)(e?e.body:"");async function n(){await(0,Q.showToast)({style:Q.Toast.Style.Animated,title:`${e?"Updating":"Adding"} comment`});try{e?await o.updateComment(e.id,{body:c}):await o.createComment({body:c,issueId:t.id}),await(0,Q.showToast)({style:Q.Toast.Style.Success,title:`${e?"Updated":"Added"} comment`}),i(),s&&s()}catch(r){(0,Q.showToast)({style:Q.Toast.Style.Failure,title:`Failed to ${e?"update":"add"} comment`,message:q(r)})}}return(0,gt.jsx)(Q.Form,{actions:(0,gt.jsx)(Q.ActionPanel,{children:(0,gt.jsx)(Q.Action.SubmitForm,{title:e?"Edit Comment":"Add Comment",onSubmit:n,icon:e?Q.Icon.Pencil:Q.Icon.Plus})}),children:(0,gt.jsx)(Q.Form.TextArea,{id:"comment",title:"Comment",placeholder:"Leave a comment",value:c,onChange:l})})}var h=require("@raycast/api"),oi=require("date-fns"),ri=ut(require("remove-markdown"));var ei=require("@raycast/utils");function Bt(e){let{data:t,error:s,isLoading:o,mutate:i}=(0,ei.useCachedPromise)($s,[e]);return{comments:t,commentsError:s,isLoadingComments:o,mutateComments:i}}var ti=require("@raycast/utils");function Qe(){let{linearClient:e}=k(),{data:t,error:s,isLoading:o}=(0,ti.useCachedPromise)(()=>e.viewer);return{me:t,meError:s,isLoadingMe:!t&&!s||o}}var Gt=require("@raycast/api");var si=require("@raycast/api"),zt=!1;async function ii(){zt=!!(await(0,si.getApplications)()).find(s=>s.bundleId==="com.linear")}var _t=require("react/jsx-runtime");function ft({title:e,url:t,...s}){return zt?(0,_t.jsx)(Gt.Action.Open,{title:`${e||"Open"} in Linear`,icon:"linear-app-icon.png",target:t,application:"Linear",...s}):(0,_t.jsx)(Gt.Action.OpenInBrowser,{url:t,title:`${e||"Open"} in Browser`})}var O=require("react/jsx-runtime");function Zt({issue:e}){let{linearClient:t}=k(),{me:s,isLoadingMe:o}=Qe(),{comments:i,isLoadingComments:c,mutateComments:l}=Bt(e.id);async function n(r){if(await(0,h.confirmAlert)({title:"Delete Comment",message:"Are you sure you want to delete this comment?",icon:{source:h.Icon.Trash,tintColor:h.Color.Red}}))try{await(0,h.showToast)({style:h.Toast.Style.Animated,title:"Deleting comment"}),await l(t.deleteComment(r),{optimisticUpdate(u){return u&&u?.filter(d=>d.id!==r)}}),await(0,h.showToast)({style:h.Toast.Style.Success,title:"Deleted comment"})}catch(u){(0,h.showToast)({style:h.Toast.Style.Failure,title:"Failed to delete comment",message:q(u)})}}return(0,O.jsxs)(h.List,{isLoading:c||o,navigationTitle:`${e.identifier} \u2022 Comments`,searchBarPlaceholder:"Filter by user or comment content",isShowingDetail:!0,children:[(0,O.jsx)(h.List.EmptyView,{title:"No comments",description:"This issue doesn't have any comments.",actions:(0,O.jsx)(h.ActionPanel,{children:(0,O.jsx)(h.Action.Push,{title:"Add Comment",icon:h.Icon.Plus,target:(0,O.jsx)(We,{issue:e,mutateComments:l})})})}),i?.map(r=>{let u=new Date(r.createdAt);return(0,O.jsx)(h.List.Item,{title:r.user.displayName,subtitle:r.body,icon:K(r.user),keywords:(0,ri.default)(r.body).replace(/\n/g," ").split(" "),accessories:[{date:u,tooltip:`Created: ${(0,oi.format)(u,"EEEE d MMMM yyyy 'at' HH:mm")}`}],detail:(0,O.jsx)(h.List.Item.Detail,{markdown:r.body}),actions:(0,O.jsxs)(h.ActionPanel,{children:[(0,O.jsx)(ft,{title:"Open Comment",url:r.url}),s?.id===r.user.id?(0,O.jsxs)(h.ActionPanel.Section,{children:[(0,O.jsx)(h.Action.Push,{title:"Edit Comment",icon:h.Icon.Pencil,shortcut:h.Keyboard.Shortcut.Common.Edit,target:(0,O.jsx)(We,{issue:e,comment:r,mutateComments:l})}),(0,O.jsx)(h.Action,{title:"Delete Comment",icon:h.Icon.Trash,style:h.Action.Style.Destructive,shortcut:h.Keyboard.Shortcut.Common.Remove,onAction:()=>n(r.id)})]}):null,(0,O.jsx)(h.ActionPanel.Section,{children:(0,O.jsx)(h.Action.Push,{title:"Add Comment",icon:h.Icon.Plus,shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},target:(0,O.jsx)(We,{issue:e,mutateComments:l})})}),(0,O.jsxs)(h.ActionPanel.Section,{children:[(0,O.jsx)(h.Action.CopyToClipboard,{icon:h.Icon.Clipboard,content:r.url,title:"Copy Comment URL",shortcut:h.Keyboard.Shortcut.Common.CopyPath}),(0,O.jsx)(h.Action.CopyToClipboard,{icon:h.Icon.Clipboard,content:r.body,title:"Copy Comment",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,O.jsx)(h.ActionPanel.Section,{children:(0,O.jsx)(h.Action,{title:"Refresh",icon:h.Icon.ArrowClockwise,shortcut:h.Keyboard.Shortcut.Common.Refresh,onAction:l})})]})},r.id)})]})}var ze=require("@raycast/api");var ni=require("@raycast/utils");function It(){let{linearClient:e}=k(),{data:t,error:s,isLoading:o}=(0,ni.useCachedPromise)(()=>e.issuePriorityValues,[],{initialData:[]});return{priorities:t,prioritiesError:s,isLoadingPriorities:!t&&!s||o}}var a=require("@raycast/api"),Be=require("@raycast/utils"),be=require("react");function Ht(e={}){return{title:"",description:"",stateId:"",priority:"",assigneeId:"",labelIds:[],estimate:"",dueDate:null,cycleId:"",projectId:"",milestoneId:"",...e}}function eo(e){if(typeof e=="string")try{let t=JSON.parse(e);return typeof t=="object"&&t!==null?t:{}}catch{return{}}return typeof e=="object"&&e!==null?e:{}}function Se(e){return typeof e=="string"?e:void 0}function ai(e){return typeof e=="number"?String(e):Se(e)}function li(e){if(!Array.isArray(e))return;let t=e.filter(s=>typeof s=="string");return t.length>0?t:void 0}function to(e){if(typeof e!="string")return;let t=new Date(e);return Number.isNaN(t.getTime())?void 0:t}function ci(e,t={}){let s=eo(e.templateData),o=Ht(t),i=li(s.labelIds)??li(s.labels);return{title:Se(s.title)??o.title,description:Se(s.description)??o.description,stateId:Se(s.stateId)??Se(s.statusId)??o.stateId,priority:ai(s.priority)??o.priority,assigneeId:Se(s.assigneeId)??o.assigneeId,labelIds:i??o.labelIds,estimate:ai(s.estimate)??o.estimate,dueDate:s.dueDate!==void 0?to(s.dueDate)??null:o.dueDate,cycleId:Se(s.cycleId)??o.cycleId,projectId:Se(s.projectId)??o.projectId,milestoneId:o.milestoneId}}var mi=require("@raycast/utils");var ui=`
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
`;function so(e,t){let s=e.type.toLowerCase()==="issue",o=!e.team||e.team.id===t;return s&&!e.archivedAt&&o}function io(e,t){return(e.sortOrder??0)-(t.sortOrder??0)||e.name.localeCompare(t.name)}async function di(e){if(!e)return[];let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query IssueTemplates($teamId: String!, $first: Int) {
        organization {
          templates(first: $first) {
            nodes {
              ${ui}
            }
          }
        }
        team(id: $teamId) {
          templates(first: $first) {
            nodes {
              ${ui}
            }
          }
        }
      }
    `,{teamId:e,first:100});return[...s?.organization?.templates?.nodes??[],...s?.team?.templates?.nodes??[]].filter((i,c,l)=>l.findIndex(n=>n.id===i.id)===c).filter(i=>so(i,e)).sort(io)}function Kt(e,t){let{data:s,error:o,isLoading:i}=(0,mi.useCachedPromise)(di,[e],{execute:t?.execute!==!1&&!!e});return{issueTemplates:s,issueTemplatesError:o,isLoadingIssueTemplates:!s&&!o||i}}var M=require("@raycast/api"),pi=require("date-fns");var F=require("react/jsx-runtime");function yt({issue:e,mutateList:t,priorities:s,me:o}){let{issue:i,isLoadingIssue:c,mutateDetail:l}=Ue(e),n=`# ${i?.title}`;i?.description&&(n+=`

${i.description}`);let r=i?.cycle?ve(i.cycle):null,u=i.relations?i.relations.nodes.filter(L=>L.type=="related"):null,d=i.relations?i.relations.nodes.filter(L=>L.type=="duplicate"):null,P=i.attachments?.nodes.length??0;return(0,F.jsx)(M.Detail,{markdown:n,isLoading:c,...i?{metadata:(0,F.jsxs)(M.Detail.Metadata,{children:[(0,F.jsx)(M.Detail.Metadata.Label,{title:"Status",text:i.state.name,icon:_(i.state)}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Priority",text:i.priorityLabel,icon:{source:le[i.priority]}}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Assignee",text:i.assignee?i.assignee.displayName:"Unassigned",icon:K(i.assignee)}),i.team.issueEstimationType!=="notUsed"?(0,F.jsx)(M.Detail.Metadata.Label,{title:"Estimate",text:St({estimate:i.estimate,issueEstimationType:i.team.issueEstimationType}),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}):null,i.labels.nodes.length>0?(0,F.jsx)(M.Detail.Metadata.TagList,{title:"Labels",children:i.labels.nodes.map(({id:L,name:T,color:$})=>(0,F.jsx)(M.Detail.Metadata.TagList.Item,{text:T,color:$},L))}):(0,F.jsx)(M.Detail.Metadata.Label,{title:"Labels",text:"No Labels"}),i.dueDate?(0,F.jsx)(M.Detail.Metadata.Label,{title:"Due Date",text:(0,pi.format)(new Date(i.dueDate),"MM/dd/yyyy"),icon:Ct(new Date(i.dueDate))}):null,P>0?(0,F.jsx)(M.Detail.Metadata.Label,{title:"Links",text:`${P>1?`${P} links`:"1 link"}`,icon:M.Icon.Link}):null,(0,F.jsx)(M.Detail.Metadata.Separator,{}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Cycle",text:r?r.title:"No Cycle",icon:{source:r?r.icon:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Project",text:i.project?i.project.name:"No Project",icon:ce(i.project)}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Milestone",text:i.projectMilestone?i.projectMilestone.name:"No Milestone",icon:Pe(i.projectMilestone)}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Parent Issue",text:i.parent?i.parent.title:"No Issue",icon:i.parent?_(i.parent.state):{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),u&&u.length>0?(0,F.jsx)(M.Detail.Metadata.TagList,{title:"Related",children:u.map(({id:L,relatedIssue:T})=>(0,F.jsx)(M.Detail.Metadata.TagList.Item,{text:T.identifier},L))}):null,d&&d.length>0?(0,F.jsx)(M.Detail.Metadata.TagList,{title:"Duplicates",children:d.map(({id:L,relatedIssue:T})=>(0,F.jsx)(M.Detail.Metadata.TagList.Item,{text:T.identifier},L))}):null]}),actions:(0,F.jsx)(M.ActionPanel,{children:(0,F.jsx)(st,{issue:i,mutateList:t,mutateDetail:l,priorities:s,showAttachmentsAction:P>0,attachments:i.attachments?.nodes??[],me:o})})}:{}})}var f=require("react/jsx-runtime");function oo(e,t){return e==="url"?{title:"Copy Issue URL",onAction:()=>a.Clipboard.copy(t.url)}:e==="id-as-link"?{title:"Copy Issue ID as Link",onAction:()=>a.Clipboard.copy({text:`[${t.identifier}](${t.url})`,html:`<a href="${t.url}">${t.identifier}</a>`})}:e==="title"?{title:"Copy Issue Title",onAction:()=>a.Clipboard.copy(t.title)}:e==="title-as-link"?{title:"Copy Issue Title as Link",onAction:()=>a.Clipboard.copy({text:`[${t.title}](${t.url})`,html:`<a href="${t.url}">${t.title}</a>`})}:{title:"Copy Issue ID",onAction:()=>a.Clipboard.copy(t.identifier)}}function Xt(e){let{push:t}=(0,a.useNavigation)(),{autofocusField:s,copyToastAction:o}=(0,a.getPreferenceValues)(),[i,c]=(0,be.useState)(""),{teams:l,org:n,supportsTeamTypeahead:r,isLoadingTeams:u}=mt(i),d=l&&l.length>1,[P,L]=(0,be.useState)(""),{users:T,supportsUserTypeahead:$,isLoadingUsers:b}=je(P),{handleSubmit:X,itemProps:U,values:R,setValue:v,focus:W,reset:ue,setValidationError:Te}=(0,Be.useForm)({async onSubmit(m){let x=await(0,a.showToast)({style:a.Toast.Style.Animated,title:"Creating issue"}),he=d?m.teamId:l?.[0]?.id;if(!he)return Te("teamId","The team is required."),!1;try{let G={teamId:he,title:m.title,description:m.description||"",stateId:m.stateId,labelIds:m.labelIds,dueDate:m.dueDate,...N&&m.estimate?{estimate:parseInt(m.estimate)}:{},...m.assigneeId?{assigneeId:m.assigneeId}:{},...m.cycleId?{cycleId:m.cycleId}:{},...m.projectId?{projectId:m.projectId}:{},...m.milestoneId?{projectMilestoneId:m.milestoneId}:{},...m.parentId?{parentId:m.parentId}:{},priority:parseInt(m.priority)},{success:Ft,issue:He}=await Ds(G);if(Ft&&He){x.style=a.Toast.Style.Success,x.title=`Created Issue \u2022 ${He?.identifier}`,x.primaryAction={title:"Open Issue",shortcut:a.Keyboard.Shortcut.Common.OpenWith,onAction:async()=>{t((0,f.jsx)(yt,{issue:He,priorities:e.priorities,me:e.me})),await x.hide()}},x.secondaryAction={shortcut:a.Keyboard.Shortcut.Common.Copy,...oo(o,He)},ue({templateId:"",title:"",description:"",estimate:"",labelIds:[],dueDate:null,parentId:"",attachments:[],links:""}),W(d&&s?s:"title");let Et=$t(m.links);if(Et.length>0){let De=Et.length===1?"link":"links";try{x.message=`Attaching ${De}\u2026`,await Promise.all(Et.map(xe=>Tt({issueId:He.id,url:xe}))),x.message=`Successfully attached ${De}`}catch(xe){x.style=a.Toast.Style.Failure,x.title=`Failed attaching ${De}`,x.message=q(xe)}}if(m.attachments.length>0){let De=m.attachments.length===1?"attachment":"attachments";try{x.message=`Uploading ${De}\u2026`,await Promise.all(m.attachments.map(xe=>Lt({issueId:He.id,url:xe}))),x.message=`Successfully uploaded ${De}`}catch(xe){x.style=a.Toast.Style.Failure,x.title=`Failed uploading ${De}`,x.message=q(xe)}}}}catch(G){x.style=a.Toast.Style.Failure,x.title="Failed to create issue",x.message=q(G)}v("teamId",he)},validation:{teamId:d?Be.FormValidation.Required:void 0,title:Be.FormValidation.Required,stateId:Be.FormValidation.Required,priority:Be.FormValidation.Required},initialValues:{templateId:e.draftValues?.templateId||"",teamId:e.draftValues?.teamId||e.teamId,title:e.draftValues?.title,description:e.draftValues?.description,priority:e.draftValues?.priority,stateId:e.draftValues?.stateId,estimate:e.draftValues?.estimate,assigneeId:e.draftValues?.assigneeId||e.assigneeId,labelIds:e.draftValues?.labelIds||[],dueDate:e.draftValues?.dueDate,cycleId:e.draftValues?.cycleId||e.cycleId,projectId:e.draftValues?.projectId||e.projectId,milestoneId:e.draftValues?.milestoneId||e.milestoneId,parentId:e.draftValues?.parentId||e.parentId,links:e.draftValues?.links||""}}),Z=!!R.teamId&&R.teamId.trim().length>0,{issueTemplates:ne,isLoadingIssueTemplates:ye}=Kt(R.teamId,{execute:Z}),{states:I}=me(R.teamId,{execute:Z}),{labels:A}=Ne(R.teamId,{execute:Z}),{cycles:D}=Ee(R.teamId,{execute:Z}),{issues:z}=pe(tt,[],{execute:Z}),{projects:$e}=Oe(R.teamId,{execute:Z}),{milestones:Re}=Ve(R.projectId,{execute:!!R.projectId});(0,be.useEffect)(()=>{l?.length===1&&v("teamId",l[0].id)},[l]);let Ze=(0,be.useRef)(!1);(0,be.useEffect)(()=>{if(!Ze.current){Ze.current=!0;return}J("")},[R.teamId]);function J(m){v("templateId",m);let x=ne?.find(Ft=>Ft.id===m),he={assigneeId:e.assigneeId||"",cycleId:e.cycleId||"",projectId:e.projectId||"",milestoneId:e.milestoneId||""},G=x?ci(x,he):Ht(he);v("title",G.title),v("description",G.description),v("stateId",G.stateId),v("priority",G.priority),v("assigneeId",G.assigneeId),v("labelIds",G.labelIds),v("estimate",G.estimate),v("dueDate",G.dueDate),v("cycleId",G.cycleId),v("projectId",G.projectId),v("milestoneId",G.milestoneId??"")}let E=l?.find(m=>m.id===R.teamId),N=E?Xe({issueEstimationType:E.issueEstimationType,issueEstimationAllowZero:E.issueEstimationAllowZero,issueEstimationExtended:E.issueEstimationExtended}):null,Mt=Ye(I||[]),kt=I&&I.length>0,p=e.priorities&&e.priorities.length>0,H=A&&A.length>0,de=D&&D.length>0,ct=$e&&$e.length>0,ds=Re&&Re.length>0,Ut=z&&z.length>0,vi=ne&&ne.length>0;return(0,f.jsxs)(a.Form,{enableDrafts:e.enableDrafts,actions:(0,f.jsxs)(a.ActionPanel,{children:[(0,f.jsx)(a.Action.SubmitForm,{icon:a.Icon.Plus,onSubmit:X,title:"Create Issue"}),(0,f.jsxs)(a.ActionPanel.Section,{children:[(0,f.jsx)(a.Action,{title:"Focus Title",icon:a.Icon.TextInput,onAction:()=>W("title"),shortcut:a.Keyboard.Shortcut.Common.Edit}),(0,f.jsx)(a.Action,{title:"Focus Description",icon:a.Icon.TextInput,onAction:()=>W("description"),shortcut:{modifiers:["ctrl"],key:"e"}}),(0,f.jsx)(a.Action,{title:"Focus Status",icon:a.Icon.Circle,onAction:()=>W("stateId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}}}),(0,f.jsx)(a.Action,{title:"Focus Priority",icon:a.Icon.LevelMeter,onAction:()=>W("priority"),shortcut:a.Keyboard.Shortcut.Common.Pin}),(0,f.jsx)(a.Action,{title:"Focus Assignee",icon:a.Icon.AddPerson,onAction:()=>W("assigneeId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}}}),N?(0,f.jsx)(a.Action,{title:"Focus Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},onAction:()=>W("estimate"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}}}):null,(0,f.jsx)(a.Action,{title:"Focus Due Date",icon:a.Icon.Calendar,onAction:()=>W("dueDate"),shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}}}),(0,f.jsx)(a.Action,{title:"Focus Labels",icon:a.Icon.Tag,onAction:()=>W("labelIds"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}}}),de?(0,f.jsx)(a.Action,{title:"Focus Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},onAction:()=>W("cycleId"),shortcut:a.Keyboard.Shortcut.Common.Copy}):null,ct?(0,f.jsx)(a.Action,{title:"Focus Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},onAction:()=>W("projectId"),shortcut:{modifiers:["ctrl","shift"],key:"p"}}):null,ds?(0,f.jsx)(a.Action,{title:"Focus Milestone",icon:{source:{light:"light/milestone.svg",dark:"dark/milestone.svg"}},onAction:()=>W("milestoneId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}):null,Ut?(0,f.jsx)(a.Action,{title:"Focus Parent Issue",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}},onAction:()=>W("parentId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}}}):null,(0,f.jsx)(a.Action,{title:"Focus Attachments",icon:a.Icon.NewDocument,onAction:()=>W("attachments"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,f.jsx)(a.Action,{title:"Focus Links",icon:a.Icon.Link,onAction:()=>W("links"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}})]})]}),isLoading:u||b||e.isLoading,children:[(r||d)&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(a.Form.Dropdown,{title:"Team",storeValue:!0,...U.teamId,...r&&{onSearchTextChange:c,isLoading:u,throttle:!0},children:l?.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:m.name,value:m.id,icon:At(m,n)},m.id))}),(0,f.jsx)(a.Form.Separator,{})]}),Z&&(ye||vi)?(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(a.Form.Dropdown,{id:"templateId",title:"Template",value:R.templateId||"",onChange:J,isLoading:ye,children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"No Template",value:"",icon:a.Icon.Document}),ne?.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:m.name,value:m.id,icon:a.Icon.Document},m.id))]}),(0,f.jsx)(a.Form.Separator,{})]}):null,(0,f.jsx)(a.Form.TextField,{title:"Title",placeholder:"Issue title",...s==="title"?{autoFocus:!0}:{},...U.title}),(0,f.jsx)(a.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",enableMarkdown:!0,...U.description}),(0,f.jsx)(a.Form.Dropdown,{title:"Status",storeValue:!0,...U.stateId,children:kt?Mt.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:m.name,value:m.id,icon:_(m)},m.id)):null}),(0,f.jsx)(a.Form.Dropdown,{title:"Priority",storeValue:!0,...U.priority,children:p?e.priorities?.map(({priority:m,label:x})=>(0,f.jsx)(a.Form.Dropdown.Item,{title:x,value:String(m),icon:{source:le[m]}},m)):null}),(0,f.jsxs)(a.Form.Dropdown,{title:"Assignee",storeValue:!0,...U.assigneeId,...$&&{onSearchTextChange:L,isLoading:b,throttle:!0},children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:a.Icon.Person}),T?.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:m.name,value:m.id,icon:K(m)},m.id))]}),(0,f.jsx)(a.Form.TagPicker,{title:"Labels",placeholder:"Add label",...U.labelIds,children:H?A.map(({id:m,name:x,color:he})=>(0,f.jsx)(a.Form.TagPicker.Item,{title:x,value:m,icon:{source:a.Icon.Dot,tintColor:he}},m)):null}),N?(0,f.jsxs)(a.Form.Dropdown,{title:"Estimate",...U.estimate,children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),N.map(({estimate:m,label:x})=>(0,f.jsx)(a.Form.Dropdown.Item,{title:x,value:String(m),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},m))]}):null,(0,f.jsx)(a.Form.DatePicker,{title:"Due Date",type:a.Form.DatePicker.Type.Date,...U.dueDate}),de||ct||Ut?(0,f.jsx)(a.Form.Separator,{}):null,de?(0,f.jsxs)(a.Form.Dropdown,{title:"Cycle",storeValue:!0,...U.cycleId,children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),ke(D).map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:m.title,value:m.id,icon:{source:m.icon}},m.id))]}):null,ct?(0,f.jsxs)(a.Form.Dropdown,{title:"Project",storeValue:!0,...U.projectId,children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),$e.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:`${m.name} (${m.status.name})`,value:m.id,icon:ce(m)},m.id))]}):null,ds?(0,f.jsxs)(a.Form.Dropdown,{title:"Milestone",storeValue:!0,...U.milestoneId,children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),Re.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:`${m.name} (${m.targetDate||"No Target Date"})`,value:m.id,icon:Pe(m)},m.id))]}):null,Ut?(0,f.jsxs)(a.Form.Dropdown,{title:"Parent",...U.parentId,children:[(0,f.jsx)(a.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),z.map(m=>(0,f.jsx)(a.Form.Dropdown.Item,{title:`${m.identifier} - ${m.title}`,value:m.id,icon:_(m.state)},m.id))]}):null,(0,f.jsx)(a.Form.Separator,{}),(0,f.jsx)(a.Form.FilePicker,{title:"Attachment",...U.attachments}),(0,f.jsx)(a.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...U.links})]})}var Ae=require("react/jsx-runtime");function Jt({issue:e,mutateList:t}){let{issues:s,isLoadingIssues:o,mutateList:i}=pe(u=>Ls(u),[e.id]),{priorities:c,isLoadingPriorities:l}=It(),{me:n,isLoadingMe:r}=Qe();return(0,Ae.jsxs)(ze.List,{isLoading:o||r||l||r,navigationTitle:`${e.identifier} \u2022 Sub-issues`,children:[(0,Ae.jsx)(ze.List.EmptyView,{title:"No issues",description:"This issue doesn't have any sub-issues.",actions:(0,Ae.jsx)(ze.ActionPanel,{children:(0,Ae.jsx)(ze.Action.Push,{title:"Create Sub-Issue",target:(0,Ae.jsx)(Xt,{priorities:c,me:n,parentId:e.id,projectId:e.project?.id,cycleId:e.cycle?.id,teamId:e.team.id})})})}),s?.map(u=>(0,Ae.jsx)(ht,{issue:u,mutateList:t,mutateSubIssues:i,priorities:c,me:n},u.id))]})}var j=require("@raycast/api");function fi(e){let t=[`Work on Linear issue ${e.identifier}:`,""],s=ro(e.branchName);if(s&&t.push(`Suggested branch name: ${s}`,""),t.push(`<issue identifier="${Dt(e.identifier)}">`),t.push(`<title>${e.title}</title>`),t.push(...Ii(e.description)),e.team?.name&&t.push(`<team name="${Dt(e.team.name)}"/>`),e.labels?.nodes?.forEach(i=>{t.push(`<label>${i.name}</label>`)}),e.project?.name){let i=Dt(e.project.name);t.push(e.project.description?`<project name="${i}">${e.project.description}</project>`:`<project name="${i}"/>`)}e.parent&&t.push(...gi("parent-issue",e.parent));let o=e.children?.nodes??[];return o.length>0&&(t.push("<sub-issues>"),o.forEach(i=>t.push(...gi("sub-issue",i))),t.push("</sub-issues>")),t.push("</issue>"),t.join(`
`)}function gi(e,t){return[`<${e} identifier="${Dt(t.identifier)}">`,`<id>${t.id}</id>`,`<title>${t.title}</title>`,...Ii(t.description),`</${e}>`]}function Ii(e){return e?e.includes(`
`)?["<description>",e,"</description>"]:[`<description>${e}</description>`]:[]}function ro(e){return e&&e.slice(e.lastIndexOf("/")+1)}function Dt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var te=require("react/jsx-runtime"),no={ISSUE_TITLE:"title",ISSUE_ID:"identifier",ISSUE_URL:"url",ISSUE_BRANCH_NAME:"branchName"};function ao(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function lo(e){return e.replace(/\[/g,"\\[").replace(/\]/g,"\\]")}function co(e){return{html:`<a href="${e.url}">${ao(e.title)}</a>`,text:`[${lo(e.title)}](${e.url})`}}function Yt({issue:e}){let{issueCustomCopyAction:t}=(0,j.getPreferenceValues)();async function s(){let o=await(0,j.showToast)({style:j.Toast.Style.Animated,title:"Copying prompt"});try{await j.Clipboard.copy(fi(await Ts(e.id))),o.style=j.Toast.Style.Success,o.title="Copied prompt to clipboard"}catch(i){o.style=j.Toast.Style.Failure,o.title="Failed copying prompt",o.message=q(i)}}return(0,te.jsxs)(j.ActionPanel.Section,{children:[(0,te.jsx)(j.Action.CopyToClipboard,{content:e.identifier,title:"Copy Issue ID",shortcut:{macOS:{modifiers:["cmd"],key:"."},Windows:{modifiers:["ctrl"],key:"."}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:{html:`<a href="${e.url}" title="${e.title}">${e.identifier}: ${e.title}</a>`,text:e.url},title:"Copy Formatted Issue URL",shortcut:j.Keyboard.Shortcut.Common.CopyPath}),(0,te.jsx)(j.Action.CopyToClipboard,{content:e.url,title:"Copy Issue URL",shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:e.title,title:"Copy Issue Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:co(e),title:"Copy Title as Link",shortcut:{macOS:{modifiers:["cmd","shift"],key:"t"},Windows:{modifiers:["ctrl","shift"],key:"t"}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:e.branchName,title:"Copy Git Branch Name",shortcut:j.Keyboard.Shortcut.Common.CopyName}),t&&t!==""?(0,te.jsx)(j.Action.CopyToClipboard,{content:t?.replace(/\{(.*?)\}/g,(o,i)=>{let c=e[no[i]];return c||o}),title:"Custom Copy",shortcut:{macOS:{modifiers:["cmd","opt"],key:"."},Windows:{modifiers:["ctrl","alt"],key:"."}}}):null,(0,te.jsx)(j.Action,{icon:j.Icon.Clipboard,title:"Copy as Prompt",onAction:s,shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"p"},Windows:{modifiers:["ctrl","alt","shift"],key:"p"}}})]})}var se=require("@raycast/api"),yi=require("react");var ie=require("react/jsx-runtime");function es({issue:e,updateIssue:t}){let{linearClient:s}=k(),[o,i]=(0,yi.useState)(!1),{cycles:c,isLoadingCycles:l}=Ee(e.team.id,{execute:o}),n=e.cycle?ve(e.cycle):null,r=n?.isActive||!1,u=n?.isNext||!1;async function d(T){let $=e.cycle;t({animatedTitle:"Moving to cycle",payload:{cycleId:T?.id||null},optimisticUpdate(b){return{...b,cycle:T||void 0}},rollbackUpdate(b){return{...b,cycle:$}},successTitle:T?"Moved to cycle":"Removed from cycle",successMessage:T?.title?T.title:"",errorTitle:"Failed to move to cycle"})}async function P(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),$=ke(T||[]),b=$.findIndex(R=>R.isActive),U=(b>-1?$[b]:null)?$[b+1]:null;if(U)return d(U)}async function L(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),b=ke(T||[]).find(X=>X.isActive);if(b)return d(b)}return(0,ie.jsxs)(ie.Fragment,{children:[(0,ie.jsxs)(se.ActionPanel.Submenu,{title:"Move to Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:se.Keyboard.Shortcut.Common.Copy,onOpen:()=>i(!0),children:[(0,ie.jsx)(se.Action,{title:"No Cycle",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}},onAction:()=>d(null)}),!c&&l?(0,ie.jsx)(se.Action,{title:"Loading\u2026"}):ke(c||[]).map(T=>(0,ie.jsx)(se.Action,{autoFocus:T.id===n?.id,title:T.title,icon:{source:T.icon},onAction:()=>d(T)},T.id))]}),r?null:(0,ie.jsx)(se.Action,{title:"Move to Active Cycle",icon:{source:{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}},shortcut:se.Keyboard.Shortcut.Common.Copy,onAction:()=>L()}),u?null:(0,ie.jsx)(se.Action,{title:"Move to Next Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},onAction:()=>P()})]})}var oe=require("@raycast/api"),hi=require("lodash"),ki=require("react");var ge=require("react/jsx-runtime");function ts({issue:e,updateIssue:t}){let[s,o]=(0,ki.useState)(!1),{labels:i}=Ne(e.team.id,{execute:s}),[,c]=(0,hi.partition)(i||[],r=>e.labels.nodes.map(u=>u.id).includes(r.id));async function l(r){let u=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Adding label",payload:{labelIds:[...u,r.id]},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,r]}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(P=>P.id!==r.id)}}},successTitle:"Added label",successMessage:`Label "${r.name}" added to ${e.identifier}`,errorTitle:"Failed to add label"})}async function n(r){let u=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Remove label",payload:{labelIds:u.filter(d=>d!==r.id)},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(P=>P.id!==r.id)}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,r]}}},successTitle:"Removed label",successMessage:`Label "${r.name}" removed from ${e.identifier}`,errorTitle:"Failed to remove label"})}return(0,ge.jsxs)(ge.Fragment,{children:[(0,ge.jsx)(oe.ActionPanel.Submenu,{title:"Add Label",icon:oe.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},onOpen:()=>o(!0),children:c.map(r=>(0,ge.jsx)(oe.Action,{title:r.name,icon:{source:oe.Icon.Dot,tintColor:r.color},onAction:()=>l(r)},r.id))}),e.labels.nodes.length>0?(0,ge.jsx)(oe.ActionPanel.Submenu,{title:"Remove Label",icon:oe.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},children:e.labels.nodes.map(r=>(0,ge.jsx)(oe.Action,{title:r.name,icon:{source:oe.Icon.Dot,tintColor:r.color},onAction:()=>n(r)},r.id))}):null]})}var Le=require("@raycast/api"),Pi=require("react");var it=require("react/jsx-runtime");function ss({issue:e,updateIssue:t}){let[s,o]=(0,Pi.useState)(!1),{milestones:i,isLoadingMilestones:c}=Ve(e.project?.id,{execute:s});async function l(n){let r=e.projectMilestone;t({animatedTitle:"Setting milestone",payload:{projectMilestoneId:n?n.id:null},optimisticUpdate(u){return{...u,milestone:n||void 0}},rollbackUpdate(u){return{...u,milestone:r}},successTitle:n?"Set milestone":`Removed milestone from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set milestone"})}return(0,it.jsxs)(Le.ActionPanel.Submenu,{title:"Set Milestone",icon:{source:"linear-icons/milestone.svg",tintColor:Le.Color.PrimaryText},shortcut:{modifiers:["ctrl","shift"],key:"m"},onOpen:()=>o(!0),children:[(0,it.jsx)(Le.Action,{title:"No Milestone",icon:{source:"linear-icons/no-milestone.svg"},onAction:()=>l(null)}),!i&&c?(0,it.jsx)(Le.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,it.jsx)(Le.Action,{autoFocus:n.id===e.projectMilestone?.id,title:`${n.name}  (${n.targetDate||"No Target Date"})`,icon:Pe(n),onAction:()=>l(n)},n.id))]})}var ot=require("@raycast/api"),wi=require("react");var fe=require("react/jsx-runtime");function is({issue:e,updateIssue:t}){let[s,o]=(0,wi.useState)(!1),{issues:i,isLoadingIssues:c}=pe(tt,[],{execute:s}),l=e.parent,n=l?.id,r=!!n;async function u(d){t({animatedTitle:"Setting parent issue",payload:{parentId:d?d.id:null},optimisticUpdate(P){return{...P,parent:d||void 0}},rollbackUpdate(P){return{...P,parent:l}},successTitle:"Set parent issue",successMessage:d?`${d.identifier} set as parent issue`:`Removed parent issue from ${e.identifier}`,errorTitle:"Failed to set parent issue"})}return(0,fe.jsxs)(fe.Fragment,{children:[(0,fe.jsx)(ot.ActionPanel.Submenu,{title:r?"Change Parent Issue":"Set Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"i"},onOpen:()=>o(!0),children:!i&&c?(0,fe.jsx)(ot.Action,{title:"Loading\u2026"}):(i||[]).map(d=>(0,fe.jsx)(ot.Action,{autoFocus:d.id===n,title:`${d.identifier} - ${d.title}`,icon:_(d.state),onAction:()=>u(d)},d.id))}),r?(0,fe.jsx)(ot.Action,{title:"Remove Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"k"},Windows:{modifiers:["ctrl","shift"],key:"k"}},onAction:()=>u(null)}):null]})}var rt=require("@raycast/api"),Ci=require("react");var nt=require("react/jsx-runtime");function os({issue:e,updateIssue:t}){let[s,o]=(0,Ci.useState)(!1),{projects:i,isLoadingProjects:c}=Oe(e.team.id,{execute:s});async function l(n){let r=e.project;t({animatedTitle:"Setting project",payload:{projectId:n?n.id:null},optimisticUpdate(u){return{...u,project:n||void 0}},rollbackUpdate(u){return{...u,project:r}},successTitle:n?"Set project":`Removed project from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set project"})}return(0,nt.jsxs)(rt.ActionPanel.Submenu,{title:"Set Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"p"},onOpen:()=>o(!0),children:[(0,nt.jsx)(rt.Action,{title:"No Project",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}},onAction:()=>l(null)}),!i&&c?(0,nt.jsx)(rt.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,nt.jsx)(rt.Action,{autoFocus:n.id===e.project?.id,title:`${n.name} (${n.status.name})`,icon:ce(n),onAction:()=>l(n)},n.id))]})}var Ge=require("@raycast/api"),Si=require("react");var xt=require("react/jsx-runtime");function rs({issue:e,updateIssue:t}){let[s,o]=(0,Si.useState)(!1),{states:i,isLoadingStates:c}=me(e.team.id,{execute:s}),l=Ye(i||[]);async function n(r){let u=e.state;t({animatedTitle:"Setting status",payload:{stateId:r.id},optimisticUpdate(d){return{...d,state:r}},rollbackUpdate(d){return{...d,state:u}},successTitle:"Set status",successMessage:`${e.identifier} set to ${r.name}`,errorTitle:"Failed to set status"})}return(0,xt.jsx)(Ge.ActionPanel.Submenu,{icon:Ge.Icon.Circle,title:"Set Status",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},onOpen:()=>o(!0),children:l.length===0&&c?(0,xt.jsx)(Ge.Action,{title:"Loading\u2026"}):l.map(r=>(0,xt.jsx)(Ge.Action,{autoFocus:r.id===e.state.id,title:r.name,icon:_(r),onAction:()=>n(r)},r.id))})}var w=require("react/jsx-runtime");function st({issue:e,mutateList:t,mutateSubIssues:s,mutateDetail:o,showAttachmentsAction:i,attachments:c,priorities:l,me:n}){let{pop:r}=(0,g.useNavigation)(),{linearClient:u}=k(),d=e.assignee?.id===n?.id,P=Xe({issueEstimationType:e.team.issueEstimationType,issueEstimationAllowZero:e.team.issueEstimationAllowZero,issueEstimationExtended:e.team.issueEstimationExtended});async function L({animatedTitle:I,payload:A,optimisticUpdate:D,rollbackUpdate:z,successTitle:$e,successMessage:Re,errorTitle:Ze}){try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:I});let J=u.updateIssue(e.id,A);await Promise.all([J,t?t(J,{optimisticUpdate(E){if(E)return E.map(N=>N.id===e.id?D(N):N)},rollbackOnError(E){if(E)return E.map(N=>N.id===e.id?z(N):N)}}):Promise.resolve(),s?s(J,{optimisticUpdate(E){if(E)return E.map(N=>N.id===e.id?D(N):N)},rollbackOnError(E){if(E)return E.map(N=>N.id===e.id?z(N):N)}}):Promise.resolve(),o?o(J,{optimisticUpdate(E){return D(E)},rollbackOnError(E){return z(E)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:$e,message:Re})}catch(J){await(0,g.showToast)({style:g.Toast.Style.Failure,title:Ze,message:q(J)})}}async function T(){if(await(0,g.confirmAlert)({title:"Delete Issue",message:"Are you sure you want to delete the selected issue?",icon:{source:g.Icon.Trash,tintColor:g.Color.Red}}))try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Deleting issue"});let I=u.deleteIssue(e.id);o&&r(),await Promise.all([I,t?t(I,{optimisticUpdate(A){if(A)return A.filter(D=>D.id!==e.id)}}):Promise.resolve(),s?s(I,{optimisticUpdate(A){if(A)return A.filter(D=>D.id!==e.id)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Issue deleted",message:`"${e.title}" is deleted`})}catch(I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to delete issue",message:q(I)})}}async function $(I){let A=e.priority;L({animatedTitle:"Setting priority",payload:{priority:I.priority},optimisticUpdate(D){return{...D,priority:I.priority}},rollbackUpdate(D){return{...D,priority:A}},successTitle:"Set priority",successMessage:`${e.identifier} priority set to ${I.label}`,errorTitle:"Failed to set priority"})}async function b(I){let A=e.assignee;L({animatedTitle:"Setting assignee",payload:{assigneeId:I.id},optimisticUpdate(D){return{...D,assignee:I}},rollbackUpdate(D){return{...D,assignee:A}},successTitle:"Set assignee",successMessage:`${e.identifier} assigned to ${I.displayName}`,errorTitle:"Failed to set assignee"})}async function X(I){let A=e.assignee;L({animatedTitle:"Setting assignee",payload:{assigneeId:I?I.id:null},optimisticUpdate(D){return{...D,assignee:I||void 0}},rollbackUpdate(D){return{...D,assignee:A}},successTitle:"Set assignee",successMessage:`${e.identifier} ${I?"assigned to":"un-assigned from"} me`,errorTitle:"Failed to set assignee"})}async function U({estimate:I,label:A}){let D=e.estimate;L({animatedTitle:"Setting estimate",payload:{estimate:I},optimisticUpdate(z){return{...z,estimate:I}},rollbackUpdate(z){return{...z,estimate:D}},successTitle:"Set estimate",successMessage:`${e.identifier} estimate set to ${A}`,errorTitle:"Failed to set estimate"})}async function R(I){L({animatedTitle:I?"Setting due date":"Removing due date",payload:{dueDate:I},optimisticUpdate(A){return{...A,dueDate:I}},rollbackUpdate(A){return{...A,dueDate:A.dueDate}},successTitle:I?"Set due date":"Removed due date",successMessage:I?`${e.identifier} due date set to ${(0,ns.format)(I,"MM/dd/yyyy")}`:"",errorTitle:"Failed to set due date"})}async function v(I){if(!I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed setting reminder"});return}try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Setting reminder"}),await u.issueReminder(e.id,I),o&&r(),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Reminder set",message:`${e.identifier} reminder set to ${(0,ns.format)(I,"MM/dd/yyyy")}`})}catch(A){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to set reminder",message:q(A)})}}function W(){t&&t(),s&&s(),o&&o()}let[ue,Te]=(0,bi.useState)(""),{users:Z,supportsUserTypeahead:ne,isLoadingUsers:ye}=je(ue);return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(ft,{title:"Open Issue",url:e.url}),(0,w.jsxs)(g.ActionPanel.Section,{children:[(0,w.jsx)(g.Action.Push,{title:"Edit Issue",icon:g.Icon.Pencil,shortcut:g.Keyboard.Shortcut.Common.Edit,target:(0,w.jsx)(qt,{priorities:l,me:n,issue:e,mutateList:t,mutateSubIssues:s})}),(0,w.jsx)(rs,{issue:e,updateIssue:L}),l&&l.length>0?(0,w.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.LevelMeter,title:"Set Priority",shortcut:{macOS:{modifiers:["cmd","opt"],key:"p"},Windows:{modifiers:["ctrl","alt"],key:"p"}},children:l.map(I=>(0,w.jsx)(g.Action,{autoFocus:I.priority===e.priority,title:I.label,icon:{source:le[I.priority]},onAction:()=>$(I)},I.priority))}):null,(0,w.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.AddPerson,title:"Assign to",shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}},...ne&&{onSearchTextChange:Te,isLoading:ye,throttle:!0},children:Z?.map(I=>(0,w.jsx)(g.Action,{autoFocus:I.id===e.assignee?.id,title:`${I.displayName} (${I.email})`,icon:K(I),onAction:()=>b(I)},I.id))}),n?(0,w.jsx)(g.Action,{title:d?"Un-Assign from Me":"Assign to Me",icon:K(n),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}},onAction:()=>X(d?null:n)}):null,P?(0,w.jsx)(g.ActionPanel.Submenu,{title:"Set Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}},children:P.map(({estimate:I,label:A})=>(0,w.jsx)(g.Action,{autoFocus:I===e.estimate,title:A,onAction:()=>U({estimate:I,label:A})},I))}):null,(0,w.jsx)(g.Action.PickDate,{title:"Set Due Date",shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}},onChange:R}),(0,w.jsx)(g.Action.PickDate,{title:"Set Reminder",shortcut:{macOS:{modifiers:["cmd","shift"],key:"h"},Windows:{modifiers:["ctrl","shift"],key:"h"}},onChange:v}),(0,w.jsx)(ts,{issue:e,updateIssue:L}),(0,w.jsx)(es,{issue:e,updateIssue:L}),(0,w.jsx)(os,{issue:e,updateIssue:L}),(0,w.jsx)(ss,{issue:e,updateIssue:L}),(0,w.jsx)(is,{issue:e,updateIssue:L}),(0,w.jsx)(g.Action,{title:"Delete Issue",shortcut:g.Keyboard.Shortcut.Common.Remove,icon:g.Icon.Trash,style:g.Action.Style.Destructive,onAction:()=>T()})]}),(0,w.jsxs)(g.ActionPanel.Section,{children:[(0,w.jsx)(g.Action.Push,{title:"Show Sub-Issues",icon:g.Icon.List,target:(0,w.jsx)(Jt,{issue:e,mutateList:t}),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}),(0,w.jsx)(g.Action.Push,{title:"Break Issues into Sub-Issues",icon:g.Icon.Stars,target:(0,w.jsx)(Vt,{issue:e}),shortcut:{macOS:{modifiers:["opt","shift"],key:"m"},Windows:{modifiers:["alt","shift"],key:"m"}}}),i?(0,w.jsx)(g.Action.Push,{title:"Show Issue Links",icon:g.Icon.Link,target:(0,w.jsx)(Qt,{attachments:c??[],issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}}):null,(0,w.jsx)(g.Action.Push,{title:"Add Attachments and Links",icon:g.Icon.NewDocument,target:(0,w.jsx)(Rt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,w.jsx)(g.Action.Push,{title:"Add Comment",icon:g.Icon.Plus,target:(0,w.jsx)(We,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"n"},Windows:{modifiers:["ctrl","alt","shift"],key:"n"}}}),(0,w.jsx)(g.Action.Push,{title:"Show Comments",icon:g.Icon.Bubble,target:(0,w.jsx)(Zt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"c"},Windows:{modifiers:["ctrl","alt","shift"],key:"c"}}})]}),(0,w.jsx)(Yt,{issue:e}),(0,w.jsx)(g.ActionPanel.Section,{children:(0,w.jsx)(g.Action,{title:"Refresh",icon:g.Icon.ArrowClockwise,shortcut:g.Keyboard.Shortcut.Common.Refresh,onAction:()=>W()})})]})}var _e=require("react/jsx-runtime");function ht({issue:e,mutateList:t,mutateSubIssues:s,priorities:o,me:i}){let c=[e.identifier,e.state.name,e.priorityLabel];e.assignee&&c.push(e.assignee.email,e.assignee.displayName);let l=new Date(e.updatedAt),n=e.dueDate?new Date(e.dueDate):null,r=e.estimate?{icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},text:St({estimate:e.estimate,issueEstimationType:e.team.issueEstimationType})}:null,u=e.cycle?ve(e.cycle):null,d=e.project||null,P=e.labels.nodes.length>0,L=[{date:l,tooltip:`Updated: ${(0,vt.format)(l,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:n?Ct(n):void 0,text:n?(0,vt.format)(n,"MMM dd"):void 0,tooltip:n?`Due date: ${(0,vt.format)(n,"MM/dd/yyyy")}`:void 0},{icon:P?Ie.Icon.Tag:void 0,text:P?String(e.labels.nodes.length):void 0,tooltip:P?e.labels.nodes.map(T=>T.name).join(", "):void 0},{icon:d?ce(d):void 0,tooltip:`Project: ${d?d.name:void 0}`},{icon:u?{source:u.icon}:void 0,text:u?String(u.number):void 0,tooltip:u?`Cycle: ${u.title}`:void 0},{icon:r?r.icon:void 0,text:r?r.text:void 0},{icon:_(e.state),tooltip:`Status: ${e.state.name}`},{icon:K(e.assignee),tooltip:e.assignee?`Assignee: ${e.assignee?.displayName} (${e.assignee?.email})`:"Unassigned"}];return(0,_e.jsx)(Ie.List.Item,{title:e.title,icon:{value:{source:le[e.priority]},tooltip:`Priority: ${e.priorityLabel}`},subtitle:e.identifier,keywords:c,accessories:L,actions:(0,_e.jsxs)(Ie.ActionPanel,{title:e.identifier,children:[(0,_e.jsx)(Ie.Action.Push,{title:"Show Details",icon:Ie.Icon.Sidebar,target:(0,_e.jsx)(yt,{issue:e,mutateList:t,priorities:o,me:i})}),(0,_e.jsx)(st,{issue:e,mutateList:t,mutateSubIssues:s,priorities:o,me:i})]})},e.id)}var lt=require("@raycast/api"),Ai=require("@raycast/utils"),jt=ut(require("react"));var at=require("react/jsx-runtime");function uo({children:e}){return(0,jt.useEffect)(()=>{ii()},[]),e}var as=class extends jt.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}render(){let{error:t}=this.state;if(!t)return this.props.children;if(!(t.message.includes("invalid_grant")||t.message.includes("Error while fetching tokens")||t.message.includes("Could not initialize OAuth")))throw t;return(0,at.jsx)(lt.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${t.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,at.jsx)(lt.ActionPanel,{children:(0,at.jsx)(lt.Action,{title:"Sign in Again",onAction:async()=>{await Nt.client.removeTokens(),this.setState({error:null})}})})})}},mo=(0,Ai.withAccessToken)(Nt)(uo);function ls({children:e}){return(0,at.jsx)(as,{children:(0,at.jsx)(mo,{children:e})})}var cs=require("@raycast/utils");async function Li(){let{graphQLClient:e}=k();return(await et(async s=>e.rawRequest(`
          query($cursor: String) {
            customViews(first: 50, after: $cursor) {
              nodes {
                id
                name
                icon
                color
                shared
                modelName
                team {
                  id
                  name
                  key
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }
        `,{cursor:s}),s=>s.data?.customViews?.pageInfo,(s,o)=>s.concat(o.data?.customViews?.nodes??[]),[],5)).filter(s=>s.modelName==="Issue")}async function Ti(e){let{graphQLClient:t}=k();return et(async s=>t.rawRequest(`
          query($viewId: String!, $cursor: String) {
            customView(id: $viewId) {
              issues(first: 50, after: $cursor) {
                nodes {
                  ${Me}
                }
                pageInfo {
                  hasNextPage
                  endCursor
                }
              }
            }
          }
        `,{viewId:e,cursor:s}),s=>s.data?.customView?.issues?.pageInfo??void 0,(s,o)=>s.concat(o.data?.customView?.issues?.nodes??[]),[],5)}function $i(){let{data:e,error:t,isLoading:s}=(0,cs.useCachedPromise)(Li);return{customViews:e,customViewsError:t,isLoadingCustomViews:s}}function Ri(e){let{data:t,error:s,isLoading:o,mutate:i}=(0,cs.useCachedPromise)(Ti,[e],{execute:!!e});return{issues:t,issuesError:s,isLoadingIssues:o,mutateList:i}}var re=require("react/jsx-runtime");function Di({viewId:e,viewName:t}){let{issues:s,issuesError:o,isLoadingIssues:i,mutateList:c}=Ri(e),{priorities:l,isLoadingPriorities:n}=It(),{me:r,isLoadingMe:u}=Qe();(0,us.useEffect)(()=>{o&&(0,B.showToast)({style:B.Toast.Style.Failure,title:"Failed to load issues",message:o.message})},[o]);let d=s?.length===1?"1 issue":`${s?.length??0} issues`;return(0,re.jsx)(B.List,{navigationTitle:t,isLoading:i||n||u,searchBarPlaceholder:"Filter issues",children:(0,re.jsx)(B.List.Section,{title:t,subtitle:d,children:s?.map(P=>(0,re.jsx)(ht,{issue:P,mutateList:c,priorities:l,me:r},P.id))})})}function po(){let{customViews:e,customViewsError:t,isLoadingCustomViews:s}=$i();return(0,us.useEffect)(()=>{t&&(0,B.showToast)({style:B.Toast.Style.Failure,title:"Failed to load custom views",message:t.message})},[t]),(0,re.jsx)(B.List,{isLoading:s,searchBarPlaceholder:"Search custom views",children:e?.map(o=>{let i=[];return o.team&&i.push({tag:o.team.name,tooltip:`Team: ${o.team.name}`}),o.shared&&i.push({icon:B.Icon.TwoPeople,tooltip:"Shared view"}),(0,re.jsx)(B.List.Item,{icon:Je({icon:o.icon??void 0,color:o.color??void 0,fallbackIcon:B.Icon.Layers}),title:o.name,accessories:i,actions:(0,re.jsx)(B.ActionPanel,{children:(0,re.jsx)(B.Action.Push,{title:"Show Issues",icon:B.Icon.List,target:(0,re.jsx)(Di,{viewId:o.id,viewName:o.name})})})},o.id)})})}function xi(){return(0,re.jsx)(ls,{children:(0,re.jsx)(po,{})})}0&&(module.exports={CustomViewIssues});
