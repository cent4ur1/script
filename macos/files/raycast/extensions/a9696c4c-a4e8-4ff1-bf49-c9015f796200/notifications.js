"use strict";var Os=Object.create;var ht=Object.defineProperty;var Vs=Object.getOwnPropertyDescriptor;var qs=Object.getOwnPropertyNames;var Ws=Object.getPrototypeOf,Bs=Object.prototype.hasOwnProperty;var Qs=(e,t)=>{for(var i in t)ht(e,i,{get:t[i],enumerable:!0})},gi=(e,t,i,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let s of qs(t))!Bs.call(e,s)&&s!==i&&ht(e,s,{get:()=>t[s],enumerable:!(r=Vs(t,s))||r.enumerable});return e};var Ye=(e,t,i)=>(i=e!=null?Os(Ws(e)):{},gi(t||!e||!e.__esModule?ht(i,"default",{value:e,enumerable:!0}):i,e)),zs=e=>gi(ht({},"__esModule",{value:!0}),e);var kr={};Qs(kr,{default:()=>Fs});module.exports=zs(kr);var f=require("@raycast/api"),Es=require("date-fns");var fi=require("@linear/sdk"),Ii=require("@raycast/api"),yi=require("@raycast/utils"),mt=null;async function Gs(e,t,i,r,s){let a=JSON.stringify({query:i,variables:r}),c=new Headers(t.headers);new Headers(s).forEach((u,d)=>c.set(d,u)),c.set("Content-Type","application/json");let n=await fetch(e,{...t,method:"POST",headers:Object.fromEntries(c.entries()),body:a}),o=n.headers.get("Content-Type")?.startsWith("application/json")?await n.json():await n.text();if(typeof o!="string"&&n.ok&&!o.errors&&o.data)return{...o,headers:n.headers,status:n.status};throw new Error(typeof o=="string"?o:o.errors?.[0]?.message??`GraphQL Error (${n.status})`)}var Ot=yi.OAuthService.linear({scope:"read write",onAuthorize({token:e}){mt=new fi.LinearClient({accessToken:e,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":Ii.environment.extensionName}});let t=mt.client;t.rawRequest=((i,r,s)=>Gs(t.url,t.options,i,r,s))}});function b(){if(!mt)throw new Error("No linear client initialized");return{linearClient:mt,graphQLClient:mt.client}}async function hi(e){let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
      mutation {
        notificationArchive(id: "${e}") {
          success
        }
      }
    `);return{success:i?.notificationArchive.success}}async function kt(e){let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
      mutation {
        notificationUpdate(id: "${e.id}", input: {readAt: ${e.readAt?`"${e.readAt.toISOString()}"`:null}}) {
          success
        }
      }
    `);return{success:i?.notificationUpdate.success}}var O=require("@raycast/api"),Ts=require("date-fns");var de=require("date-fns"),_s=10080*60*1e3;function Me(e){let t=Date.now(),i=Date.now()+_s,r=new Date(e.startsAt),s=new Date(e.endsAt),a=!e.completedAt&&(0,de.isBefore)(r,t)&&(0,de.isAfter)(s,t),c=!e.completedAt&&(0,de.isBefore)(r,i)&&(0,de.isAfter)(s,i),n=a?{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}:{light:"light/cycle.svg",dark:"dark/cycle.svg"},o=`Cycle ${e.number} (${(0,de.format)(r,"dd MMM")} - ${(0,de.format)(s,"dd MMM")})`,u=a?`Active ${o}`:o;return{...e,isActive:a,isNext:c,icon:n,title:u}}function be(e){return e.filter(t=>(0,de.isAfter)(new Date(t.endsAt),Date.now())).map(Me)}var et=require("@raycast/api"),St=require("date-fns");function bt(e){let t=(0,St.differenceInDays)(e,(0,St.startOfToday)()),i=et.Color.PrimaryText;return t<=7&&(i=et.Color.Orange),t<=0&&(i=et.Color.Red),{source:et.Icon.Calendar,tintColor:i}}var ki={exponential:[0,1,2,4,8,16,32,64],fibonacci:[0,1,2,3,5,8,13,21],linear:[0,1,2,3,4,5,6,7],tShirt:[0,1,2,3,5,8,13,21]},Si={0:"\u2013",1:"XS",2:"S",3:"M",5:"L",8:"XL",13:"XXL",21:"XXXL"};function Pt({estimate:e,issueEstimationType:t}){if(!e)return"Not estimated";if(t==="tShirt"){let i=Si[e];return i||String(e)}return String(e)}function tt({issueEstimationType:e,issueEstimationAllowZero:t,issueEstimationExtended:i}){if(e==="notUsed")return null;let r=t?0:1,s=i?ki[e].length:6,a=ki[e].slice(r,s);return e==="tShirt"?a.map(c=>({estimate:c,label:Si[c]})):a.map(c=>({estimate:c,label:c!==1?`${c} points`:`${c} point`}))}var Vt=require("@raycast/api");function Pe(e){return e?{source:"linear-icons/milestone.svg",tintColor:Vt.Color.PrimaryText}:{source:"linear-icons/no-milestone.svg",tintColor:Vt.Color.SecondaryText}}var me={0:{light:"light/priority-no-priority.svg",dark:"dark/priority-no-priority.svg"},1:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"},2:{light:"light/priority-high.svg",dark:"dark/priority-high.svg"},3:{light:"light/priority-medium.svg",dark:"dark/priority-medium.svg"},4:{light:"light/priority-low.svg",dark:"dark/priority-low.svg"}};var bi=Ye(require("fs")),Pi=require("@raycast/api"),Ci=Ye(require("node-emoji"));function Ct({icon:e,color:t,fallbackIcon:i}){if(!e)return i;if(/:(.*):/.test(e))return Ci.get(e)??i;let s=`${Pi.environment.assetsPath}/linear-icons/${e.toLowerCase()}.svg`;return bi.default.existsSync(s)?{source:s,...t?{tintColor:{light:t,dark:t,adjustContrast:!0}}:{}}:i}function pe(e){return e?Ct({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var wi=require("lodash");var Hs={triage:{light:"light/triage.svg",dark:"dark/triage.svg"},backlog:{light:"light/backlog.svg",dark:"dark/backlog.svg"},unstarted:{light:"light/unstarted.svg",dark:"dark/unstarted.svg"},started:{light:"light/started.svg",dark:"dark/started.svg"},completed:{light:"light/completed.svg",dark:"dark/completed.svg"},canceled:{light:"light/canceled.svg",dark:"dark/canceled.svg"}};function Z(e){return{source:Hs[e.type],tintColor:{light:e.color,dark:e.color,adjustContrast:!0}}}function it(e,t=["triage","backlog","unstarted","started","completed","canceled"]){if(e.length===0)return[];let i=(0,wi.groupBy)(e,r=>r.type);return t.filter(r=>!!i[r]).map(r=>i[r]).flat()}var wt=require("@raycast/api"),Ai=require("@raycast/utils");function J(e){return e?{source:e.avatarUrl?encodeURI(e.avatarUrl):(0,Ai.getAvatarIcon)(e.displayName.toUpperCase()),mask:wt.Image.Mask.Circle}:wt.Icon.Person}var xi=require("@raycast/utils");var Li=require("@raycast/api");async function qt(e,t,i,r,s){let a=r,c=!0,n,o=0;for(;c&&o<s;){let u=await e(n);a=i(a,u),c=t(u)?.hasNextPage,n=t(u)?.endCursor,o++}return a}var Ks=(0,Li.getPreferenceValues)();function Ti({inFilterBlock:e,addComma:t,inParentheses:i}={inFilterBlock:!1,inParentheses:!1,addComma:!0}){return Ks.shouldHideRedundantIssues?[...i?["("]:[],...t?[", "]:[],...e?[]:["filter: { "],"completedAt: { null: true }, canceledAt: { null: true }",...e?[]:[" }"],...i?[")"]:[]].join(""):""}var Ue=`
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
`;async function st(){let{graphQLClient:e}=b(),{data:t}=await e.rawRequest(`
      query {
        issues(orderBy: createdAt${Ti()}) {
          nodes {
            ${Ue}
          }
        }
      }
    `);return t?.issues.nodes}async function Ri(e){let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          children${Ti({inParentheses:!0})} {
            nodes {
              ${Ue}
              sortOrder
            }
          }
        }
      }
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue.children.nodes}async function $i(e){let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
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
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue}async function Di(e){let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
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
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue.comments.nodes}async function vi(e){let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          ${Ue}
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
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue}function Ee(e){let t=e.id,{data:i,error:r,isLoading:s,mutate:a}=(0,xi.useCachedPromise)(vi,[t],{initialData:{...e,description:""}});return{issue:i,issueError:r,isLoadingIssue:s,mutateDetail:a}}var I=require("@raycast/api"),ci=require("date-fns"),Ls=require("react");function U(e){return e instanceof Error?e.message:String(e)}var ji=require("@raycast/utils");function Fe(e=""){let{linearClient:t}=b(),{data:i,error:r,isLoading:s}=(0,ji.useCachedPromise)(async a=>{let c=await t.users(a.trim().length>0?{filter:{name:{containsIgnoreCase:a}}}:void 0);return{users:c?.nodes??[],hasMoreUsers:!!c?.pageInfo?.hasNextPage}},[e],{initialData:[]});return{users:i?.users,supportsUserTypeahead:e.trim().length>0||i?.hasMoreUsers,usersError:r,isLoadingUsers:!i&&!r||s}}var T=require("@raycast/api"),Fi=require("@raycast/utils"),Ni=require("nanoid"),Ne=require("react");async function Mi(e){let{graphQLClient:t}=b(),i=e.title.replace(/"/g,"\\$&"),r=e.description?.replace(/\n/g,"\\n")?.replace(/"/g,"\\$&"),s=`teamId: "${e.teamId}", title: "${i}", description: "${r}", priority: ${e.priority}`;e.stateId&&(s+=`, stateId: "${e.stateId}"`),e.estimate&&(s+=`, estimate: ${e.estimate}`),e.assigneeId&&(s+=`, assigneeId: "${e.assigneeId}"`),e.labelIds&&e.labelIds.length>0&&(s+=`, labelIds: [${e.labelIds.map(c=>`"${c}"`).join(",")}]`),e.dueDate&&(s+=`, dueDate: "${e.dueDate.toISOString()}"`),e.cycleId&&(s+=`, cycleId: "${e.cycleId}"`),e.projectId&&(s+=`, projectId: "${e.projectId}"`),e.projectId&&e.projectMilestoneId&&(s+=`, projectMilestoneId: "${e.projectMilestoneId}"`),e.parentId&&(s+=`, parentId: "${e.parentId}"`);let{data:a}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${s}}) {
          success
          issue {
            ${Ue}
          }
        }
      }
    `);return{success:a?.issueCreate.success,issue:a?.issueCreate.issue}}async function Ui(e){let{graphQLClient:t}=b(),i=e.title.replace(/"/g,"\\$&"),r=e.description?.replace(/\n/g,"\\n").replace(/"/g,"\\$&"),s=`teamId: "${e.teamId}", title: "${i}", description: "${r}", parentId: "${e.parentId}"`;e.stateId&&(s+=`, stateId: "${e.stateId}"`);let{data:a}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${s}}) {
          success
        }
      }
    `);return{success:a?.issueCreate.success}}var Ei=require("@raycast/utils");function fe(e,t){let{linearClient:i}=b(),{data:r,error:s,isLoading:a}=(0,Ei.useCachedPromise)(async c=>(await i.workflowStates({filter:{team:{id:{eq:c}}}})).nodes.sort((o,u)=>o.position-u.position),[e],{initialData:[],execute:t?.execute!==!1});return{states:r,isLoadingStates:a,statesError:s}}var se=require("react/jsx-runtime");function Wt({issue:e}){let{pop:t}=(0,T.useNavigation)(),{states:i}=fe(e.team.id),r=(0,Ne.useMemo)(()=>i.filter($=>$.type==="unstarted")[0],[i]),{issue:s,isLoadingIssue:a}=Ee(e),{data:c,isLoading:n,revalidate:o}=(0,Fi.useAI)(`Act as a product manager for Linear issues. Break down a Linear issue into a list of sub-issues. 
    
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

${s.description?`To give you more context and help in creating sub-issues, here's the Linear issue description:
"""
${s.description}
"""
`:""}

Break down the Linear issue with this title: "${s.title}"`,{execute:!!s&&!a,creativity:.5}),[u,d]=(0,Ne.useState)(!1),[A,D]=(0,Ne.useState)([]);(0,Ne.useEffect)(()=>{if(!(!c||n)){try{let x=/\[[\s\S]*?\]/,$=c.match(x);if($&&$[0]){let j=JSON.parse($[0]);D(j.map(p=>({...p,id:(0,Ni.nanoid)(),selected:!0})))}}catch(x){(0,T.showToast)({style:T.Toast.Style.Failure,title:"Failed to parse AI results",message:U(x),primaryAction:{title:"Retry",onAction:o},secondaryAction:{title:"Copy AI Result",onAction:()=>T.Clipboard.copy(c)}})}d(!0)}},[c,n]);async function v(){try{await(0,T.showToast)({style:T.Toast.Style.Animated,title:"Creating sub-issues"});let x=A.filter($=>$.selected);await Promise.all(x.map($=>Ui({teamId:s.team.id,title:$.title,description:$.description,parentId:s.id,stateId:r?.id}))),await(0,T.showToast)({style:T.Toast.Style.Success,title:"Created sub-issues"}),t()}catch(x){(0,T.showToast)({style:T.Toast.Style.Failure,title:"Failed to create Sub-Issues",message:U(x)})}}return(0,se.jsxs)(T.List,{isLoading:n||!u,children:[A?.map(x=>(0,se.jsx)(T.List.Item,{icon:x.selected?{source:T.Icon.CheckCircle,tintColor:T.Color.Green}:T.Icon.Circle,title:x.title,subtitle:x.description,actions:(0,se.jsxs)(T.ActionPanel,{children:[(0,se.jsx)(T.Action,{title:x.selected?"Unselect Sub-Issue":"Select Sub-Issue",icon:x.selected?T.Icon.Circle:{source:T.Icon.CheckCircle,tintColor:T.Color.Green},onAction:()=>D(A.map($=>$.id===x.id?{...$,selected:!$.selected}:$))}),(0,se.jsx)(T.Action,{title:"Create Sub-Issues",icon:T.Icon.Plus,onAction:()=>v()}),(0,se.jsx)(T.Action,{title:"Generate New Sub-Issues",icon:T.Icon.ArrowClockwise,onAction:o})]})},x.title)),(0,se.jsx)(T.List.EmptyView,{title:"No sub-issues were generated. Try again.",actions:(0,se.jsx)(T.ActionPanel,{children:(0,se.jsx)(T.Action,{title:"Retry",icon:T.Icon.ArrowClockwise,onAction:o})})})]})}var P=require("@raycast/api"),Be=require("@raycast/utils"),gt=require("react");async function Oi(e,t){let{graphQLClient:i}=b(),r=[];if(t.teamId&&r.push(`teamId: "${t.teamId}"`),t.title&&r.push(`title: "${t.title.replace(/"/g,"\\$&")}"`),t.description&&r.push(`description: "${t.description.replace(/\n/g,"\\n").replace(/"/g,"\\$&")}"`),t.stateId&&r.push(`stateId: "${t.stateId}"`),typeof t.priority<"u"&&r.push(`priority: ${t.priority}`),typeof t.assigneeId<"u"&&r.push(`assigneeId: ${t.assigneeId?`"${t.assigneeId}"`:null}`),t.labelIds&&r.push(`labelIds: [${t.labelIds.map(a=>`"${a}"`).join(",")}]`),typeof t.estimate<"u"&&r.push(`estimate: ${t.estimate}`),typeof t.dueDate<"u"){let a=t.dueDate?t.dueDate instanceof Date?t.dueDate.toISOString():t.dueDate:null;r.push(`dueDate: ${a?`"${a}"`:null}`)}typeof t.cycleId<"u"&&r.push(`cycleId: ${t.cycleId?`"${t.cycleId}"`:null}`),typeof t.projectId<"u"&&r.push(`projectId: ${t.projectId?`"${t.projectId}"`:null}`),typeof t.projectMilestoneId<"u"&&r.push(`projectMilestoneId: ${t.projectMilestoneId?`"${t.projectMilestoneId}"`:null}`),typeof t.parentId<"u"&&r.push(`parentId: ${t.parentId?`"${t.parentId}"`:null}`);let{data:s}=await i.rawRequest(`
      mutation {
        issueUpdate(id: "${e}", input: {${r.join(", ")}}) {
          success
        }
      }
    `);return{success:s?.issueUpdate.success}}var Vi=require("@raycast/api");function At(e,t){let i=t?.logoUrl?encodeURI(t.logoUrl):Vi.Icon.TwoPeople;return Ct({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:i})}var qi=require("@raycast/utils");function Oe(e,t){let{linearClient:i}=b(),{data:r,error:s,isLoading:a}=(0,qi.useCachedPromise)(async c=>(await i.cycles({filter:{team:{id:{eq:c}}}})).nodes.sort((o,u)=>o.number-u.number),[e],{execute:t?.execute!==!1&&!!e});return{cycles:r,cyclesError:s,isLoadingCycles:!r&&!s||a}}var Wi=require("@raycast/utils");function Ie(e,t=[],i){let{data:r,error:s,isLoading:a,mutate:c}=(0,Wi.useCachedPromise)(e,t,i);return{issues:r,issuesError:s,isLoadingIssues:a,mutateList:c}}var zi=require("@raycast/utils");var Bi=require("@raycast/api");var Zs=100,Xs=100,Js=(0,Bi.getPreferenceValues)();function Ys(){let e=Number(Js.labelsLimit),t=Number.isFinite(e)&&e>0?e:Xs,i=Math.floor(Math.min(Zs,t)),r=Math.ceil(t/i);return{pageSize:i,pageLimit:r}}async function Qi(e){if(!e)return[];let{pageSize:t,pageLimit:i}=Ys(),{graphQLClient:r}=b();return qt(async s=>r.rawRequest(`
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
        `,{teamId:e,cursor:s}),s=>s.data?.team?.labels?.pageInfo,(s,a)=>s.concat(a.data?.team?.labels?.nodes??[]),[],i)}function Ve(e,t){let{data:i,error:r,isLoading:s}=(0,zi.useCachedPromise)(Qi,[e],{execute:t?.execute!==!1&&!!e});return{labels:i,labelsError:r,isLoadingLabels:!i&&!r||s}}var _i=require("@raycast/utils");var er=`
  id
  name
  targetDate
  project {
      id
  }
  sortOrder
  updatedAt
`;async function Gi(e){let{graphQLClient:t}=b();if(e){let{data:i}=await t.rawRequest(`
        query($projectId: String!) {
          project(id: $projectId) {
            projectMilestones {
              nodes {
                ${er}
              }
            }
          }
        }
      `,{projectId:e});return i?.project.projectMilestones.nodes}return null}function qe(e,t){let{data:i,error:r,isLoading:s,mutate:a}=(0,_i.useCachedPromise)(Gi,[e],{execute:t?.execute!==!1});return{milestones:i,isLoadingMilestones:!i&&!r||s,milestonesError:r,mutateMilestones:a}}var Ki=require("@raycast/utils");var tr=`
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
`;async function Hi({teamId:e,searchText:t="",after:i=null,first:r=null}){let{graphQLClient:s}=b(),a=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${tr}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;if(!e){let{data:o}=await s.rawRequest(`
        query($first: Int, $after: String, $searchText: String) {
          ${a}
        }
      `,{first:r,after:i,searchText:t}),u=o?.projects;return{data:u?.nodes??[],hasMore:!!u?.pageInfo.hasNextPage,cursor:u?.pageInfo.endCursor||null}}let{data:c}=await s.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${a}
        }
      }
    `,{teamId:e,first:r,after:i,searchText:t}),n=c?.team?.projects;return{data:n?.nodes??[],hasMore:!!n?.pageInfo.hasNextPage,cursor:n?.pageInfo.endCursor||null}}function We(e,t){let{data:i,error:r,isLoading:s,mutate:a,pagination:c}=(0,Ki.useCachedPromise)((n,o)=>u=>Hi({teamId:n,searchText:o,after:u.cursor,first:t?.pageSize}),[e,t?.searchText],{execute:t?.execute!==!1,keepPreviousData:!0});return{projects:i,isLoadingProjects:!i&&!r||s,projectsError:r,mutateProjects:a,pagination:c}}var Ji=require("@raycast/utils");var Zi=require("lodash");async function Xi(e=""){let{graphQLClient:t,linearClient:i}=b(),r=await i.viewer,{data:s}=await t.rawRequest(`
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
    `,{userId:r.id,query:e}),a=(0,Zi.sortBy)(s?.teams.nodes??[],o=>o.membership?.sortOrder??1/0),c=s?.organization,n=!!s?.teams.pageInfo.hasNextPage;return{teams:a,organization:c,hasMoreTeams:n}}function pt(e=""){let{data:t,error:i,isLoading:r}=(0,Ji.useCachedPromise)(Xi,[e]);return{teams:t?.teams,org:t?.organization,teamsError:i,isLoadingTeams:!t&&!i||r,supportsTeamTypeahead:e.trim().length>0||t?.hasMoreTeams}}var L=require("react/jsx-runtime");function Bt(e){let{pop:t}=(0,P.useNavigation)(),{issue:i,isLoadingIssue:r,mutateDetail:s}=Ee(e.issue),[a,c]=(0,gt.useState)(""),{teams:n,org:o,supportsTeamTypeahead:u,isLoadingTeams:d}=pt(a),A=n&&n.length>1,[D,v]=(0,gt.useState)(""),{users:x,supportsUserTypeahead:$,isLoadingUsers:j}=Fe(D),{handleSubmit:p,itemProps:k,values:S,setValue:F}=(0,Be.useForm)({async onSubmit(g){let ee=await(0,P.showToast)({style:P.Toast.Style.Animated,title:"Editing issue"});try{let ge={teamId:g.teamId||e.issue.team.id,title:g.title,description:g.description,stateId:g.stateId,labelIds:g.labelIds,dueDate:g.dueDate,...K&&g.estimate?{estimate:parseInt(g.estimate)}:{},...g.assigneeId?{assigneeId:g.assigneeId}:{},...g.cycleId?{cycleId:g.cycleId}:{},...g.projectId?{projectId:g.projectId}:{},...g.milestoneId?{projectMilestoneId:g.milestoneId}:{},...g.parentId?{parentId:g.parentId}:{},priority:parseInt(g.priority)},{success:dt}=await Oi(i.id,ge);dt&&(ee.style=P.Toast.Style.Success,ee.title=`Edited Issue \u2022 ${i.identifier}`,t(),s(),e.mutateList&&e.mutateList(),e.mutateSubIssues&&e.mutateSubIssues())}catch(ge){ee.style=P.Toast.Style.Failure,ee.title="Failed to edit issue",ee.message=U(ge)}},validation:{teamId:A?Be.FormValidation.Required:void 0,title:Be.FormValidation.Required,stateId:Be.FormValidation.Required,priority:Be.FormValidation.Required},initialValues:{teamId:e.issue.team.id,title:e.issue.title,description:i.description??void 0,priority:String(e.issue.priority),stateId:e.issue.state.id,estimate:e.issue.estimate?String(e.issue.estimate):void 0,assigneeId:e.issue.assignee?.id,labelIds:e.issue.labels.nodes.map(g=>g.id),dueDate:i.dueDate?new Date(i.dueDate):null,cycleId:e.issue.cycle?.id,projectId:e.issue.project?.id,milestoneId:e.issue.projectMilestone?.id,parentId:e.issue.parent?.id}});(0,gt.useEffect)(()=>{F("description",i.description||""),F("dueDate",i.dueDate?new Date(i.dueDate):null)},[i]);let ce=!!S.teamId&&S.teamId.trim().length>0,{states:te}=fe(S.teamId,{execute:ce}),{labels:H}=Ve(S.teamId,{execute:ce}),{cycles:Y}=Oe(S.teamId,{execute:ce}),{issues:ue}=Ie(st,[],{execute:ce}),{projects:h}=We(S.teamId,{execute:ce}),{milestones:R}=qe(S.projectId,{execute:!!S.projectId}),M=n?.find(g=>g.id===S.teamId),K=M?tt({issueEstimationType:M.issueEstimationType,issueEstimationAllowZero:M.issueEstimationAllowZero,issueEstimationExtended:M.issueEstimationExtended}):null,De=it(te||[]),ve=te&&te.length>0,Xe=e.priorities&&e.priorities.length>0,ie=H&&H.length>0,q=Y&&Y.length>0,W=h&&h.length>0,Ut=R&&R.length>0,yt=ue&&ue.length>0;return(0,L.jsxs)(P.Form,{actions:(0,L.jsx)(P.ActionPanel,{children:(0,L.jsx)(P.Action.SubmitForm,{onSubmit:p,title:"Edit Issue"})}),isLoading:d||r||j,children:[(u||A)&&(0,L.jsxs)(L.Fragment,{children:[(0,L.jsx)(P.Form.Dropdown,{title:"Team",...k.teamId,...u&&{onSearchTextChange:c,isLoading:d,throttle:!0},children:n?.map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:g.name,value:g.id,icon:At(g,o)},g.id))}),(0,L.jsx)(P.Form.Separator,{})]}),(0,L.jsx)(P.Form.TextField,{title:"Title",placeholder:"Issue title",autoFocus:!0,...k.title}),(0,L.jsx)(P.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...k.description}),(0,L.jsx)(P.Form.Dropdown,{title:"Status",...k.stateId,children:ve?De.map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:g.name,value:g.id,icon:Z(g)},g.id)):null}),(0,L.jsx)(P.Form.Dropdown,{title:"Priority",...k.priority,children:Xe?e.priorities?.map(({priority:g,label:ee})=>(0,L.jsx)(P.Form.Dropdown.Item,{title:ee,value:String(g),icon:{source:me[g]}},g)):null}),(0,L.jsxs)(P.Form.Dropdown,{title:"Assignee",...k.assigneeId,...$&&{onSearchTextChange:v,isLoading:j,throttle:!0},children:[(0,L.jsx)(P.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:P.Icon.Person}),x?.map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:g.name,value:g.id,icon:J(g)},g.id))]}),(0,L.jsx)(P.Form.TagPicker,{title:"Labels",...k.labelIds,placeholder:"Add label",children:ie?H.map(({id:g,name:ee,color:ge})=>(0,L.jsx)(P.Form.TagPicker.Item,{title:ee,value:g,icon:{source:P.Icon.Dot,tintColor:ge}},g)):null}),K?(0,L.jsxs)(P.Form.Dropdown,{title:"Estimate",...k.estimate,children:[(0,L.jsx)(P.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),K.map(({estimate:g,label:ee})=>(0,L.jsx)(P.Form.Dropdown.Item,{title:ee,value:String(g),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},g))]}):null,(0,L.jsx)(P.Form.DatePicker,{title:"Due Date",type:P.Form.DatePicker.Type.Date,...k.dueDate}),q||W||yt?(0,L.jsx)(P.Form.Separator,{}):null,q?(0,L.jsxs)(P.Form.Dropdown,{title:"Cycle",...k.cycleId,children:[(0,L.jsx)(P.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),be(Y).map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:g.title,value:g.id,icon:{source:g.icon}},g.id))]}):null,W?(0,L.jsxs)(P.Form.Dropdown,{title:"Project",...k.projectId,children:[(0,L.jsx)(P.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),h.map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:`${g.name} (${g.status.name})`,value:g.id,icon:pe(g)},g.id))]}):null,Ut?(0,L.jsxs)(P.Form.Dropdown,{title:"Milestone",storeValue:!0,...k.milestoneId,children:[(0,L.jsx)(P.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),R.map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:`${g.name}  (${g.targetDate||"No Target Date"})`,value:g.id,icon:Pe(g)},g.id))]}):null,yt?(0,L.jsxs)(P.Form.Dropdown,{title:"Parent",...k.parentId,children:[(0,L.jsx)(P.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),ue.map(g=>(0,L.jsx)(P.Form.Dropdown.Item,{title:`${g.identifier} - ${g.title}`,value:g.id,icon:Z(g.state)},g.id))]}):null]})}var re=require("@raycast/api"),ts=require("date-fns");var B=require("@raycast/api"),es=require("@raycast/utils");var Yi=require("fs/promises"),Qt=Ye(require("path"));var ir="application/octet-stream",sr={".apng":"image/apng",".avif":"image/avif",".bmp":"image/bmp",".csv":"text/csv",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",".gif":"image/gif",".gz":"application/gzip",".heic":"image/heic",".heif":"image/heif",".ico":"image/x-icon",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json",".md":"text/markdown",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".pdf":"application/pdf",".png":"image/png",".ppt":"application/vnd.ms-powerpoint",".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",".svg":"image/svg+xml",".tar":"application/x-tar",".tif":"image/tiff",".tiff":"image/tiff",".txt":"text/plain",".webm":"video/webm",".webp":"image/webp",".xls":"application/vnd.ms-excel",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".zip":"application/zip"};function rr(e){return sr[Qt.default.extname(e).toLowerCase()]??ir}async function or(e){let{graphQLClient:t}=b(),i=await(0,Yi.readFile)(e),r=rr(e),s=Qt.default.basename(e),{data:a}=await t.rawRequest(`
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
    `,{size:i.byteLength,contentType:r,filename:s}),c=a?.fileUpload.uploadFile;if(!a?.fileUpload.success||!c)throw new Error(`Failed to request an upload URL for "${s}"`);let n=new Headers({"Content-Type":r,"Cache-Control":"public, max-age=31536000"});c.headers.forEach(({key:u,value:d})=>n.set(u,d));let o=await fetch(c.uploadUrl,{method:"PUT",headers:n,body:i});if(!o.ok)throw new Error(`Failed to upload "${s}": ${o.status} ${o.statusText}`);return{assetUrl:c.assetUrl,contentType:r,name:s}}async function Lt(e){let{linearClient:t}=b(),i=await or(e.url),r=await t.createAttachment({issueId:e.issueId,title:i.name,url:i.assetUrl});return{success:r.success,id:r.attachmentId}}async function Tt(e){let{linearClient:t}=b(),i=await t.attachmentLinkURL(e.issueId,e.url);return{success:i.success,id:i.attachmentId}}function Rt(e){let t=e.split(`
`),i=/https?:\/\/\S+/,r=t.map(s=>s.trim()).filter(s=>i.test(s));return Array.from(new Set(r))}var Ce=require("react/jsx-runtime");function $t({issue:{id:e,title:t,identifier:i}}){let{pop:r}=(0,B.useNavigation)(),{reset:s,itemProps:a,handleSubmit:c}=(0,es.useForm)({onSubmit:async n=>{let o=await(0,B.showToast)({style:B.Toast.Style.Animated,title:"Attaching links"}),u=Rt(n.links);if(u.length===0&&n.attachments.length===0){o.style=B.Toast.Style.Failure,o.title="No links or attachments provided";return}if(u.length>0){let d=u.length===1?"link":"links";try{await Promise.all(u.map(A=>Tt({issueId:e,url:A}))),o.style=B.Toast.Style.Success,o.title=`Successfully attached ${d}`}catch(A){o.style=B.Toast.Style.Failure,o.title=`Failed attaching ${d}`,o.message=U(A)}}if(n.attachments.length>0){let d=n.attachments.length===1?"attachment":"attachments";try{o.style=B.Toast.Style.Animated,o.title=`Uploading ${d}\u2026`,await Promise.all(n.attachments.map(A=>Lt({issueId:e,url:A}))),o.style=B.Toast.Style.Success,o.title=`Successfully uploaded ${d}`}catch(A){o.style=B.Toast.Style.Failure,o.title=`Failed uploading ${d}`,o.message=U(A)}}s({attachments:[],links:""}),r()},initialValues:{links:""}});return(0,Ce.jsxs)(B.Form,{actions:(0,Ce.jsx)(B.ActionPanel,{children:(0,Ce.jsx)(B.Action.SubmitForm,{onSubmit:c,icon:B.Icon.NewDocument,title:"Attach"})}),navigationTitle:"Add Attachments and Links",children:[(0,Ce.jsx)(B.Form.Description,{title:"Issue",text:`[${i}] ${t}`}),(0,Ce.jsx)(B.Form.FilePicker,{title:"Attachment",...a.attachments}),(0,Ce.jsx)(B.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...a.links})]})}var we=require("react/jsx-runtime");function zt({attachments:e,issue:t}){return(0,we.jsx)(re.List,{navigationTitle:`Links for ${t.identifier}`,children:e.map(i=>{let r=new Date(i.updatedAt);return(0,we.jsx)(re.List.Item,{icon:i.source?.imageUrl??re.Icon.Link,title:i.title,subtitle:i.subtitle,accessories:[{date:r,tooltip:`Updated: ${(0,ts.format)(r,"EEEE d MMMM yyyy 'at' HH:mm")}`}],actions:(0,we.jsxs)(re.ActionPanel,{children:[(0,we.jsx)(re.Action.OpenInBrowser,{url:i.url}),(0,we.jsx)(re.Action.Push,{title:"Add Attachments and Links",icon:re.Icon.NewDocument,target:(0,we.jsx)($t,{issue:t})})]})},i.id)})})}var G=require("@raycast/api"),is=require("react");var ft=require("react/jsx-runtime");function Qe({comment:e,issue:t,mutateComments:i}){let{linearClient:r}=b(),{pop:s}=(0,G.useNavigation)(),[a,c]=(0,is.useState)(e?e.body:"");async function n(){await(0,G.showToast)({style:G.Toast.Style.Animated,title:`${e?"Updating":"Adding"} comment`});try{e?await r.updateComment(e.id,{body:a}):await r.createComment({body:a,issueId:t.id}),await(0,G.showToast)({style:G.Toast.Style.Success,title:`${e?"Updated":"Added"} comment`}),s(),i&&i()}catch(o){(0,G.showToast)({style:G.Toast.Style.Failure,title:`Failed to ${e?"update":"add"} comment`,message:U(o)})}}return(0,ft.jsx)(G.Form,{actions:(0,ft.jsx)(G.ActionPanel,{children:(0,ft.jsx)(G.Action.SubmitForm,{title:e?"Edit Comment":"Add Comment",onSubmit:n,icon:e?G.Icon.Pencil:G.Icon.Plus})}),children:(0,ft.jsx)(G.Form.TextArea,{id:"comment",title:"Comment",placeholder:"Leave a comment",value:a,onChange:c})})}var C=require("@raycast/api"),as=require("date-fns"),ls=Ye(require("remove-markdown"));var ss=require("@raycast/utils");function Gt(e){let{data:t,error:i,isLoading:r,mutate:s}=(0,ss.useCachedPromise)(Di,[e]);return{comments:t,commentsError:i,isLoadingComments:r,mutateComments:s}}var rs=require("@raycast/utils");function ze(){let{linearClient:e}=b(),{data:t,error:i,isLoading:r}=(0,rs.useCachedPromise)(()=>e.viewer);return{me:t,meError:i,isLoadingMe:!t&&!i||r}}var Ht=require("@raycast/api");var os=require("@raycast/api"),_t=!1;async function ns(){_t=!!(await(0,os.getApplications)()).find(i=>i.bundleId==="com.linear")}var Kt=require("react/jsx-runtime");function Ae({title:e,url:t,...i}){return _t?(0,Kt.jsx)(Ht.Action.Open,{title:`${e||"Open"} in Linear`,icon:"linear-app-icon.png",target:t,application:"Linear",...i}):(0,Kt.jsx)(Ht.Action.OpenInBrowser,{url:t,title:`${e||"Open"} in Browser`})}var Q=require("react/jsx-runtime");function Zt({issue:e}){let{linearClient:t}=b(),{me:i,isLoadingMe:r}=ze(),{comments:s,isLoadingComments:a,mutateComments:c}=Gt(e.id);async function n(o){if(await(0,C.confirmAlert)({title:"Delete Comment",message:"Are you sure you want to delete this comment?",icon:{source:C.Icon.Trash,tintColor:C.Color.Red}}))try{await(0,C.showToast)({style:C.Toast.Style.Animated,title:"Deleting comment"}),await c(t.deleteComment(o),{optimisticUpdate(u){return u&&u?.filter(d=>d.id!==o)}}),await(0,C.showToast)({style:C.Toast.Style.Success,title:"Deleted comment"})}catch(u){(0,C.showToast)({style:C.Toast.Style.Failure,title:"Failed to delete comment",message:U(u)})}}return(0,Q.jsxs)(C.List,{isLoading:a||r,navigationTitle:`${e.identifier} \u2022 Comments`,searchBarPlaceholder:"Filter by user or comment content",isShowingDetail:!0,children:[(0,Q.jsx)(C.List.EmptyView,{title:"No comments",description:"This issue doesn't have any comments.",actions:(0,Q.jsx)(C.ActionPanel,{children:(0,Q.jsx)(C.Action.Push,{title:"Add Comment",icon:C.Icon.Plus,target:(0,Q.jsx)(Qe,{issue:e,mutateComments:c})})})}),s?.map(o=>{let u=new Date(o.createdAt);return(0,Q.jsx)(C.List.Item,{title:o.user.displayName,subtitle:o.body,icon:J(o.user),keywords:(0,ls.default)(o.body).replace(/\n/g," ").split(" "),accessories:[{date:u,tooltip:`Created: ${(0,as.format)(u,"EEEE d MMMM yyyy 'at' HH:mm")}`}],detail:(0,Q.jsx)(C.List.Item.Detail,{markdown:o.body}),actions:(0,Q.jsxs)(C.ActionPanel,{children:[(0,Q.jsx)(Ae,{title:"Open Comment",url:o.url}),i?.id===o.user.id?(0,Q.jsxs)(C.ActionPanel.Section,{children:[(0,Q.jsx)(C.Action.Push,{title:"Edit Comment",icon:C.Icon.Pencil,shortcut:C.Keyboard.Shortcut.Common.Edit,target:(0,Q.jsx)(Qe,{issue:e,comment:o,mutateComments:c})}),(0,Q.jsx)(C.Action,{title:"Delete Comment",icon:C.Icon.Trash,style:C.Action.Style.Destructive,shortcut:C.Keyboard.Shortcut.Common.Remove,onAction:()=>n(o.id)})]}):null,(0,Q.jsx)(C.ActionPanel.Section,{children:(0,Q.jsx)(C.Action.Push,{title:"Add Comment",icon:C.Icon.Plus,shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},target:(0,Q.jsx)(Qe,{issue:e,mutateComments:c})})}),(0,Q.jsxs)(C.ActionPanel.Section,{children:[(0,Q.jsx)(C.Action.CopyToClipboard,{icon:C.Icon.Clipboard,content:o.url,title:"Copy Comment URL",shortcut:C.Keyboard.Shortcut.Common.CopyPath}),(0,Q.jsx)(C.Action.CopyToClipboard,{icon:C.Icon.Clipboard,content:o.body,title:"Copy Comment",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,Q.jsx)(C.ActionPanel.Section,{children:(0,Q.jsx)(C.Action,{title:"Refresh",icon:C.Icon.ArrowClockwise,shortcut:C.Keyboard.Shortcut.Common.Refresh,onAction:c})})]})},o.id)})]})}var Ke=require("@raycast/api");var cs=require("@raycast/utils");function It(){let{linearClient:e}=b(),{data:t,error:i,isLoading:r}=(0,cs.useCachedPromise)(()=>e.issuePriorityValues,[],{initialData:[]});return{priorities:t,prioritiesError:i,isLoadingPriorities:!t&&!i||r}}var l=require("@raycast/api"),Ge=require("@raycast/utils"),Te=require("react");function Xt(e={}){return{title:"",description:"",stateId:"",priority:"",assigneeId:"",labelIds:[],estimate:"",dueDate:null,cycleId:"",projectId:"",milestoneId:"",...e}}function nr(e){if(typeof e=="string")try{let t=JSON.parse(e);return typeof t=="object"&&t!==null?t:{}}catch{return{}}return typeof e=="object"&&e!==null?e:{}}function Le(e){return typeof e=="string"?e:void 0}function us(e){return typeof e=="number"?String(e):Le(e)}function ds(e){if(!Array.isArray(e))return;let t=e.filter(i=>typeof i=="string");return t.length>0?t:void 0}function ar(e){if(typeof e!="string")return;let t=new Date(e);return Number.isNaN(t.getTime())?void 0:t}function ms(e,t={}){let i=nr(e.templateData),r=Xt(t),s=ds(i.labelIds)??ds(i.labels);return{title:Le(i.title)??r.title,description:Le(i.description)??r.description,stateId:Le(i.stateId)??Le(i.statusId)??r.stateId,priority:us(i.priority)??r.priority,assigneeId:Le(i.assigneeId)??r.assigneeId,labelIds:s??r.labelIds,estimate:us(i.estimate)??r.estimate,dueDate:i.dueDate!==void 0?ar(i.dueDate)??null:r.dueDate,cycleId:Le(i.cycleId)??r.cycleId,projectId:Le(i.projectId)??r.projectId,milestoneId:r.milestoneId}}var fs=require("@raycast/utils");var ps=`
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
`;function lr(e,t){let i=e.type.toLowerCase()==="issue",r=!e.team||e.team.id===t;return i&&!e.archivedAt&&r}function cr(e,t){return(e.sortOrder??0)-(t.sortOrder??0)||e.name.localeCompare(t.name)}async function gs(e){if(!e)return[];let{graphQLClient:t}=b(),{data:i}=await t.rawRequest(`
      query IssueTemplates($teamId: String!, $first: Int) {
        organization {
          templates(first: $first) {
            nodes {
              ${ps}
            }
          }
        }
        team(id: $teamId) {
          templates(first: $first) {
            nodes {
              ${ps}
            }
          }
        }
      }
    `,{teamId:e,first:100});return[...i?.organization?.templates?.nodes??[],...i?.team?.templates?.nodes??[]].filter((s,a,c)=>c.findIndex(n=>n.id===s.id)===a).filter(s=>lr(s,e)).sort(cr)}function Jt(e,t){let{data:i,error:r,isLoading:s}=(0,fs.useCachedPromise)(gs,[e],{execute:t?.execute!==!1&&!!e});return{issueTemplates:i,issueTemplatesError:r,isLoadingIssueTemplates:!i&&!r||s}}var y=require("react/jsx-runtime");function ur(e,t){return e==="url"?{title:"Copy Issue URL",onAction:()=>l.Clipboard.copy(t.url)}:e==="id-as-link"?{title:"Copy Issue ID as Link",onAction:()=>l.Clipboard.copy({text:`[${t.identifier}](${t.url})`,html:`<a href="${t.url}">${t.identifier}</a>`})}:e==="title"?{title:"Copy Issue Title",onAction:()=>l.Clipboard.copy(t.title)}:e==="title-as-link"?{title:"Copy Issue Title as Link",onAction:()=>l.Clipboard.copy({text:`[${t.title}](${t.url})`,html:`<a href="${t.url}">${t.title}</a>`})}:{title:"Copy Issue ID",onAction:()=>l.Clipboard.copy(t.identifier)}}function Yt(e){let{push:t}=(0,l.useNavigation)(),{autofocusField:i,copyToastAction:r}=(0,l.getPreferenceValues)(),[s,a]=(0,Te.useState)(""),{teams:c,org:n,supportsTeamTypeahead:o,isLoadingTeams:u}=pt(s),d=c&&c.length>1,[A,D]=(0,Te.useState)(""),{users:v,supportsUserTypeahead:x,isLoadingUsers:$}=Fe(A),{handleSubmit:j,itemProps:p,values:k,setValue:S,focus:F,reset:ce,setValidationError:te}=(0,Ge.useForm)({async onSubmit(m){let E=await(0,l.showToast)({style:l.Toast.Style.Animated,title:"Creating issue"}),Se=d?m.teamId:c?.[0]?.id;if(!Se)return te("teamId","The team is required."),!1;try{let X={teamId:Se,title:m.title,description:m.description||"",stateId:m.stateId,labelIds:m.labelIds,dueDate:m.dueDate,...W&&m.estimate?{estimate:parseInt(m.estimate)}:{},...m.assigneeId?{assigneeId:m.assigneeId}:{},...m.cycleId?{cycleId:m.cycleId}:{},...m.projectId?{projectId:m.projectId}:{},...m.milestoneId?{projectMilestoneId:m.milestoneId}:{},...m.parentId?{parentId:m.parentId}:{},priority:parseInt(m.priority)},{success:Ft,issue:Je}=await Mi(X);if(Ft&&Je){E.style=l.Toast.Style.Success,E.title=`Created Issue \u2022 ${Je?.identifier}`,E.primaryAction={title:"Open Issue",shortcut:l.Keyboard.Shortcut.Common.OpenWith,onAction:async()=>{t((0,y.jsx)(_e,{issue:Je,priorities:e.priorities,me:e.me})),await E.hide()}},E.secondaryAction={shortcut:l.Keyboard.Shortcut.Common.Copy,...ur(r,Je)},ce({templateId:"",title:"",description:"",estimate:"",labelIds:[],dueDate:null,parentId:"",attachments:[],links:""}),F(d&&i?i:"title");let Nt=Rt(m.links);if(Nt.length>0){let xe=Nt.length===1?"link":"links";try{E.message=`Attaching ${xe}\u2026`,await Promise.all(Nt.map(je=>Tt({issueId:Je.id,url:je}))),E.message=`Successfully attached ${xe}`}catch(je){E.style=l.Toast.Style.Failure,E.title=`Failed attaching ${xe}`,E.message=U(je)}}if(m.attachments.length>0){let xe=m.attachments.length===1?"attachment":"attachments";try{E.message=`Uploading ${xe}\u2026`,await Promise.all(m.attachments.map(je=>Lt({issueId:Je.id,url:je}))),E.message=`Successfully uploaded ${xe}`}catch(je){E.style=l.Toast.Style.Failure,E.title=`Failed uploading ${xe}`,E.message=U(je)}}}}catch(X){E.style=l.Toast.Style.Failure,E.title="Failed to create issue",E.message=U(X)}S("teamId",Se)},validation:{teamId:d?Ge.FormValidation.Required:void 0,title:Ge.FormValidation.Required,stateId:Ge.FormValidation.Required,priority:Ge.FormValidation.Required},initialValues:{templateId:e.draftValues?.templateId||"",teamId:e.draftValues?.teamId||e.teamId,title:e.draftValues?.title,description:e.draftValues?.description,priority:e.draftValues?.priority,stateId:e.draftValues?.stateId,estimate:e.draftValues?.estimate,assigneeId:e.draftValues?.assigneeId||e.assigneeId,labelIds:e.draftValues?.labelIds||[],dueDate:e.draftValues?.dueDate,cycleId:e.draftValues?.cycleId||e.cycleId,projectId:e.draftValues?.projectId||e.projectId,milestoneId:e.draftValues?.milestoneId||e.milestoneId,parentId:e.draftValues?.parentId||e.parentId,links:e.draftValues?.links||""}}),H=!!k.teamId&&k.teamId.trim().length>0,{issueTemplates:Y,isLoadingIssueTemplates:ue}=Jt(k.teamId,{execute:H}),{states:h}=fe(k.teamId,{execute:H}),{labels:R}=Ve(k.teamId,{execute:H}),{cycles:M}=Oe(k.teamId,{execute:H}),{issues:K}=Ie(st,[],{execute:H}),{projects:De}=We(k.teamId,{execute:H}),{milestones:ve}=qe(k.projectId,{execute:!!k.projectId});(0,Te.useEffect)(()=>{c?.length===1&&S("teamId",c[0].id)},[c]);let Xe=(0,Te.useRef)(!1);(0,Te.useEffect)(()=>{if(!Xe.current){Xe.current=!0;return}ie("")},[k.teamId]);function ie(m){S("templateId",m);let E=Y?.find(Ft=>Ft.id===m),Se={assigneeId:e.assigneeId||"",cycleId:e.cycleId||"",projectId:e.projectId||"",milestoneId:e.milestoneId||""},X=E?ms(E,Se):Xt(Se);S("title",X.title),S("description",X.description),S("stateId",X.stateId),S("priority",X.priority),S("assigneeId",X.assigneeId),S("labelIds",X.labelIds),S("estimate",X.estimate),S("dueDate",X.dueDate),S("cycleId",X.cycleId),S("projectId",X.projectId),S("milestoneId",X.milestoneId??"")}let q=c?.find(m=>m.id===k.teamId),W=q?tt({issueEstimationType:q.issueEstimationType,issueEstimationAllowZero:q.issueEstimationAllowZero,issueEstimationExtended:q.issueEstimationExtended}):null,Ut=it(h||[]),yt=h&&h.length>0,g=e.priorities&&e.priorities.length>0,ee=R&&R.length>0,ge=M&&M.length>0,dt=De&&De.length>0,pi=ve&&ve.length>0,Et=K&&K.length>0,Ns=Y&&Y.length>0;return(0,y.jsxs)(l.Form,{enableDrafts:e.enableDrafts,actions:(0,y.jsxs)(l.ActionPanel,{children:[(0,y.jsx)(l.Action.SubmitForm,{icon:l.Icon.Plus,onSubmit:j,title:"Create Issue"}),(0,y.jsxs)(l.ActionPanel.Section,{children:[(0,y.jsx)(l.Action,{title:"Focus Title",icon:l.Icon.TextInput,onAction:()=>F("title"),shortcut:l.Keyboard.Shortcut.Common.Edit}),(0,y.jsx)(l.Action,{title:"Focus Description",icon:l.Icon.TextInput,onAction:()=>F("description"),shortcut:{modifiers:["ctrl"],key:"e"}}),(0,y.jsx)(l.Action,{title:"Focus Status",icon:l.Icon.Circle,onAction:()=>F("stateId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}}}),(0,y.jsx)(l.Action,{title:"Focus Priority",icon:l.Icon.LevelMeter,onAction:()=>F("priority"),shortcut:l.Keyboard.Shortcut.Common.Pin}),(0,y.jsx)(l.Action,{title:"Focus Assignee",icon:l.Icon.AddPerson,onAction:()=>F("assigneeId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}}}),W?(0,y.jsx)(l.Action,{title:"Focus Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},onAction:()=>F("estimate"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}}}):null,(0,y.jsx)(l.Action,{title:"Focus Due Date",icon:l.Icon.Calendar,onAction:()=>F("dueDate"),shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}}}),(0,y.jsx)(l.Action,{title:"Focus Labels",icon:l.Icon.Tag,onAction:()=>F("labelIds"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}}}),ge?(0,y.jsx)(l.Action,{title:"Focus Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},onAction:()=>F("cycleId"),shortcut:l.Keyboard.Shortcut.Common.Copy}):null,dt?(0,y.jsx)(l.Action,{title:"Focus Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},onAction:()=>F("projectId"),shortcut:{modifiers:["ctrl","shift"],key:"p"}}):null,pi?(0,y.jsx)(l.Action,{title:"Focus Milestone",icon:{source:{light:"light/milestone.svg",dark:"dark/milestone.svg"}},onAction:()=>F("milestoneId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}):null,Et?(0,y.jsx)(l.Action,{title:"Focus Parent Issue",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}},onAction:()=>F("parentId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}}}):null,(0,y.jsx)(l.Action,{title:"Focus Attachments",icon:l.Icon.NewDocument,onAction:()=>F("attachments"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,y.jsx)(l.Action,{title:"Focus Links",icon:l.Icon.Link,onAction:()=>F("links"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}})]})]}),isLoading:u||$||e.isLoading,children:[(o||d)&&(0,y.jsxs)(y.Fragment,{children:[(0,y.jsx)(l.Form.Dropdown,{title:"Team",storeValue:!0,...p.teamId,...o&&{onSearchTextChange:a,isLoading:u,throttle:!0},children:c?.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:At(m,n)},m.id))}),(0,y.jsx)(l.Form.Separator,{})]}),H&&(ue||Ns)?(0,y.jsxs)(y.Fragment,{children:[(0,y.jsxs)(l.Form.Dropdown,{id:"templateId",title:"Template",value:k.templateId||"",onChange:ie,isLoading:ue,children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"No Template",value:"",icon:l.Icon.Document}),Y?.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:l.Icon.Document},m.id))]}),(0,y.jsx)(l.Form.Separator,{})]}):null,(0,y.jsx)(l.Form.TextField,{title:"Title",placeholder:"Issue title",...i==="title"?{autoFocus:!0}:{},...p.title}),(0,y.jsx)(l.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",enableMarkdown:!0,...p.description}),(0,y.jsx)(l.Form.Dropdown,{title:"Status",storeValue:!0,...p.stateId,children:yt?Ut.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:Z(m)},m.id)):null}),(0,y.jsx)(l.Form.Dropdown,{title:"Priority",storeValue:!0,...p.priority,children:g?e.priorities?.map(({priority:m,label:E})=>(0,y.jsx)(l.Form.Dropdown.Item,{title:E,value:String(m),icon:{source:me[m]}},m)):null}),(0,y.jsxs)(l.Form.Dropdown,{title:"Assignee",storeValue:!0,...p.assigneeId,...x&&{onSearchTextChange:D,isLoading:$,throttle:!0},children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:l.Icon.Person}),v?.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:m.name,value:m.id,icon:J(m)},m.id))]}),(0,y.jsx)(l.Form.TagPicker,{title:"Labels",placeholder:"Add label",...p.labelIds,children:ee?R.map(({id:m,name:E,color:Se})=>(0,y.jsx)(l.Form.TagPicker.Item,{title:E,value:m,icon:{source:l.Icon.Dot,tintColor:Se}},m)):null}),W?(0,y.jsxs)(l.Form.Dropdown,{title:"Estimate",...p.estimate,children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),W.map(({estimate:m,label:E})=>(0,y.jsx)(l.Form.Dropdown.Item,{title:E,value:String(m),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},m))]}):null,(0,y.jsx)(l.Form.DatePicker,{title:"Due Date",type:l.Form.DatePicker.Type.Date,...p.dueDate}),ge||dt||Et?(0,y.jsx)(l.Form.Separator,{}):null,ge?(0,y.jsxs)(l.Form.Dropdown,{title:"Cycle",storeValue:!0,...p.cycleId,children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),be(M).map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:m.title,value:m.id,icon:{source:m.icon}},m.id))]}):null,dt?(0,y.jsxs)(l.Form.Dropdown,{title:"Project",storeValue:!0,...p.projectId,children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),De.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:`${m.name} (${m.status.name})`,value:m.id,icon:pe(m)},m.id))]}):null,pi?(0,y.jsxs)(l.Form.Dropdown,{title:"Milestone",storeValue:!0,...p.milestoneId,children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),ve.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:`${m.name} (${m.targetDate||"No Target Date"})`,value:m.id,icon:Pe(m)},m.id))]}):null,Et?(0,y.jsxs)(l.Form.Dropdown,{title:"Parent",...p.parentId,children:[(0,y.jsx)(l.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),K.map(m=>(0,y.jsx)(l.Form.Dropdown.Item,{title:`${m.identifier} - ${m.title}`,value:m.id,icon:Z(m.state)},m.id))]}):null,(0,y.jsx)(l.Form.Separator,{}),(0,y.jsx)(l.Form.FilePicker,{title:"Attachment",...p.attachments}),(0,y.jsx)(l.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...p.links})]})}var ye=require("@raycast/api"),Dt=require("date-fns");var He=require("react/jsx-runtime");function ei({issue:e,mutateList:t,mutateSubIssues:i,priorities:r,me:s}){let a=[e.identifier,e.state.name,e.priorityLabel];e.assignee&&a.push(e.assignee.email,e.assignee.displayName);let c=new Date(e.updatedAt),n=e.dueDate?new Date(e.dueDate):null,o=e.estimate?{icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},text:Pt({estimate:e.estimate,issueEstimationType:e.team.issueEstimationType})}:null,u=e.cycle?Me(e.cycle):null,d=e.project||null,A=e.labels.nodes.length>0,D=[{date:c,tooltip:`Updated: ${(0,Dt.format)(c,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:n?bt(n):void 0,text:n?(0,Dt.format)(n,"MMM dd"):void 0,tooltip:n?`Due date: ${(0,Dt.format)(n,"MM/dd/yyyy")}`:void 0},{icon:A?ye.Icon.Tag:void 0,text:A?String(e.labels.nodes.length):void 0,tooltip:A?e.labels.nodes.map(v=>v.name).join(", "):void 0},{icon:d?pe(d):void 0,tooltip:`Project: ${d?d.name:void 0}`},{icon:u?{source:u.icon}:void 0,text:u?String(u.number):void 0,tooltip:u?`Cycle: ${u.title}`:void 0},{icon:o?o.icon:void 0,text:o?o.text:void 0},{icon:Z(e.state),tooltip:`Status: ${e.state.name}`},{icon:J(e.assignee),tooltip:e.assignee?`Assignee: ${e.assignee?.displayName} (${e.assignee?.email})`:"Unassigned"}];return(0,He.jsx)(ye.List.Item,{title:e.title,icon:{value:{source:me[e.priority]},tooltip:`Priority: ${e.priorityLabel}`},subtitle:e.identifier,keywords:a,accessories:D,actions:(0,He.jsxs)(ye.ActionPanel,{title:e.identifier,children:[(0,He.jsx)(ye.Action.Push,{title:"Show Details",icon:ye.Icon.Sidebar,target:(0,He.jsx)(_e,{issue:e,mutateList:t,priorities:r,me:s})}),(0,He.jsx)(rt,{issue:e,mutateList:t,mutateSubIssues:i,priorities:r,me:s})]})},e.id)}var Re=require("react/jsx-runtime");function ti({issue:e,mutateList:t}){let{issues:i,isLoadingIssues:r,mutateList:s}=Ie(u=>Ri(u),[e.id]),{priorities:a,isLoadingPriorities:c}=It(),{me:n,isLoadingMe:o}=ze();return(0,Re.jsxs)(Ke.List,{isLoading:r||o||c||o,navigationTitle:`${e.identifier} \u2022 Sub-issues`,children:[(0,Re.jsx)(Ke.List.EmptyView,{title:"No issues",description:"This issue doesn't have any sub-issues.",actions:(0,Re.jsx)(Ke.ActionPanel,{children:(0,Re.jsx)(Ke.Action.Push,{title:"Create Sub-Issue",target:(0,Re.jsx)(Yt,{priorities:a,me:n,parentId:e.id,projectId:e.project?.id,cycleId:e.cycle?.id,teamId:e.team.id})})})}),i?.map(u=>(0,Re.jsx)(ei,{issue:u,mutateList:t,mutateSubIssues:s,priorities:a,me:n},u.id))]})}var N=require("@raycast/api");function ys(e){let t=[`Work on Linear issue ${e.identifier}:`,""],i=dr(e.branchName);if(i&&t.push(`Suggested branch name: ${i}`,""),t.push(`<issue identifier="${vt(e.identifier)}">`),t.push(`<title>${e.title}</title>`),t.push(...hs(e.description)),e.team?.name&&t.push(`<team name="${vt(e.team.name)}"/>`),e.labels?.nodes?.forEach(s=>{t.push(`<label>${s.name}</label>`)}),e.project?.name){let s=vt(e.project.name);t.push(e.project.description?`<project name="${s}">${e.project.description}</project>`:`<project name="${s}"/>`)}e.parent&&t.push(...Is("parent-issue",e.parent));let r=e.children?.nodes??[];return r.length>0&&(t.push("<sub-issues>"),r.forEach(s=>t.push(...Is("sub-issue",s))),t.push("</sub-issues>")),t.push("</issue>"),t.join(`
`)}function Is(e,t){return[`<${e} identifier="${vt(t.identifier)}">`,`<id>${t.id}</id>`,`<title>${t.title}</title>`,...hs(t.description),`</${e}>`]}function hs(e){return e?e.includes(`
`)?["<description>",e,"</description>"]:[`<description>${e}</description>`]:[]}function dr(e){return e&&e.slice(e.lastIndexOf("/")+1)}function vt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var oe=require("react/jsx-runtime"),mr={ISSUE_TITLE:"title",ISSUE_ID:"identifier",ISSUE_URL:"url",ISSUE_BRANCH_NAME:"branchName"};function pr(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function gr(e){return e.replace(/\[/g,"\\[").replace(/\]/g,"\\]")}function fr(e){return{html:`<a href="${e.url}">${pr(e.title)}</a>`,text:`[${gr(e.title)}](${e.url})`}}function ii({issue:e}){let{issueCustomCopyAction:t}=(0,N.getPreferenceValues)();async function i(){let r=await(0,N.showToast)({style:N.Toast.Style.Animated,title:"Copying prompt"});try{await N.Clipboard.copy(ys(await $i(e.id))),r.style=N.Toast.Style.Success,r.title="Copied prompt to clipboard"}catch(s){r.style=N.Toast.Style.Failure,r.title="Failed copying prompt",r.message=U(s)}}return(0,oe.jsxs)(N.ActionPanel.Section,{children:[(0,oe.jsx)(N.Action.CopyToClipboard,{content:e.identifier,title:"Copy Issue ID",shortcut:{macOS:{modifiers:["cmd"],key:"."},Windows:{modifiers:["ctrl"],key:"."}}}),(0,oe.jsx)(N.Action.CopyToClipboard,{content:{html:`<a href="${e.url}" title="${e.title}">${e.identifier}: ${e.title}</a>`,text:e.url},title:"Copy Formatted Issue URL",shortcut:N.Keyboard.Shortcut.Common.CopyPath}),(0,oe.jsx)(N.Action.CopyToClipboard,{content:e.url,title:"Copy Issue URL",shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}}}),(0,oe.jsx)(N.Action.CopyToClipboard,{content:e.title,title:"Copy Issue Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}}),(0,oe.jsx)(N.Action.CopyToClipboard,{content:fr(e),title:"Copy Title as Link",shortcut:{macOS:{modifiers:["cmd","shift"],key:"t"},Windows:{modifiers:["ctrl","shift"],key:"t"}}}),(0,oe.jsx)(N.Action.CopyToClipboard,{content:e.branchName,title:"Copy Git Branch Name",shortcut:N.Keyboard.Shortcut.Common.CopyName}),t&&t!==""?(0,oe.jsx)(N.Action.CopyToClipboard,{content:t?.replace(/\{(.*?)\}/g,(r,s)=>{let a=e[mr[s]];return a||r}),title:"Custom Copy",shortcut:{macOS:{modifiers:["cmd","opt"],key:"."},Windows:{modifiers:["ctrl","alt"],key:"."}}}):null,(0,oe.jsx)(N.Action,{icon:N.Icon.Clipboard,title:"Copy as Prompt",onAction:i,shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"p"},Windows:{modifiers:["ctrl","alt","shift"],key:"p"}}})]})}var ne=require("@raycast/api"),ks=require("react");var ae=require("react/jsx-runtime");function si({issue:e,updateIssue:t}){let{linearClient:i}=b(),[r,s]=(0,ks.useState)(!1),{cycles:a,isLoadingCycles:c}=Oe(e.team.id,{execute:r}),n=e.cycle?Me(e.cycle):null,o=n?.isActive||!1,u=n?.isNext||!1;async function d(v){let x=e.cycle;t({animatedTitle:"Moving to cycle",payload:{cycleId:v?.id||null},optimisticUpdate($){return{...$,cycle:v||void 0}},rollbackUpdate($){return{...$,cycle:x}},successTitle:v?"Moved to cycle":"Removed from cycle",successMessage:v?.title?v.title:"",errorTitle:"Failed to move to cycle"})}async function A(){let{nodes:v}=await i.cycles({filter:{team:{id:{eq:e.team.id}}}}),x=be(v||[]),$=x.findIndex(k=>k.isActive),p=($>-1?x[$]:null)?x[$+1]:null;if(p)return d(p)}async function D(){let{nodes:v}=await i.cycles({filter:{team:{id:{eq:e.team.id}}}}),$=be(v||[]).find(j=>j.isActive);if($)return d($)}return(0,ae.jsxs)(ae.Fragment,{children:[(0,ae.jsxs)(ne.ActionPanel.Submenu,{title:"Move to Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:ne.Keyboard.Shortcut.Common.Copy,onOpen:()=>s(!0),children:[(0,ae.jsx)(ne.Action,{title:"No Cycle",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}},onAction:()=>d(null)}),!a&&c?(0,ae.jsx)(ne.Action,{title:"Loading\u2026"}):be(a||[]).map(v=>(0,ae.jsx)(ne.Action,{autoFocus:v.id===n?.id,title:v.title,icon:{source:v.icon},onAction:()=>d(v)},v.id))]}),o?null:(0,ae.jsx)(ne.Action,{title:"Move to Active Cycle",icon:{source:{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}},shortcut:ne.Keyboard.Shortcut.Common.Copy,onAction:()=>D()}),u?null:(0,ae.jsx)(ne.Action,{title:"Move to Next Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},onAction:()=>A()})]})}var le=require("@raycast/api"),Ss=require("lodash"),bs=require("react");var he=require("react/jsx-runtime");function ri({issue:e,updateIssue:t}){let[i,r]=(0,bs.useState)(!1),{labels:s}=Ve(e.team.id,{execute:i}),[,a]=(0,Ss.partition)(s||[],o=>e.labels.nodes.map(u=>u.id).includes(o.id));async function c(o){let u=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Adding label",payload:{labelIds:[...u,o.id]},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,o]}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(A=>A.id!==o.id)}}},successTitle:"Added label",successMessage:`Label "${o.name}" added to ${e.identifier}`,errorTitle:"Failed to add label"})}async function n(o){let u=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Remove label",payload:{labelIds:u.filter(d=>d!==o.id)},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(A=>A.id!==o.id)}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,o]}}},successTitle:"Removed label",successMessage:`Label "${o.name}" removed from ${e.identifier}`,errorTitle:"Failed to remove label"})}return(0,he.jsxs)(he.Fragment,{children:[(0,he.jsx)(le.ActionPanel.Submenu,{title:"Add Label",icon:le.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},onOpen:()=>r(!0),children:a.map(o=>(0,he.jsx)(le.Action,{title:o.name,icon:{source:le.Icon.Dot,tintColor:o.color},onAction:()=>c(o)},o.id))}),e.labels.nodes.length>0?(0,he.jsx)(le.ActionPanel.Submenu,{title:"Remove Label",icon:le.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},children:e.labels.nodes.map(o=>(0,he.jsx)(le.Action,{title:o.name,icon:{source:le.Icon.Dot,tintColor:o.color},onAction:()=>n(o)},o.id))}):null]})}var $e=require("@raycast/api"),Ps=require("react");var ot=require("react/jsx-runtime");function oi({issue:e,updateIssue:t}){let[i,r]=(0,Ps.useState)(!1),{milestones:s,isLoadingMilestones:a}=qe(e.project?.id,{execute:i});async function c(n){let o=e.projectMilestone;t({animatedTitle:"Setting milestone",payload:{projectMilestoneId:n?n.id:null},optimisticUpdate(u){return{...u,milestone:n||void 0}},rollbackUpdate(u){return{...u,milestone:o}},successTitle:n?"Set milestone":`Removed milestone from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set milestone"})}return(0,ot.jsxs)($e.ActionPanel.Submenu,{title:"Set Milestone",icon:{source:"linear-icons/milestone.svg",tintColor:$e.Color.PrimaryText},shortcut:{modifiers:["ctrl","shift"],key:"m"},onOpen:()=>r(!0),children:[(0,ot.jsx)($e.Action,{title:"No Milestone",icon:{source:"linear-icons/no-milestone.svg"},onAction:()=>c(null)}),!s&&a?(0,ot.jsx)($e.Action,{title:"Loading\u2026"}):(s||[]).map(n=>(0,ot.jsx)($e.Action,{autoFocus:n.id===e.projectMilestone?.id,title:`${n.name}  (${n.targetDate||"No Target Date"})`,icon:Pe(n),onAction:()=>c(n)},n.id))]})}var nt=require("@raycast/api"),Cs=require("react");var ke=require("react/jsx-runtime");function ni({issue:e,updateIssue:t}){let[i,r]=(0,Cs.useState)(!1),{issues:s,isLoadingIssues:a}=Ie(st,[],{execute:i}),c=e.parent,n=c?.id,o=!!n;async function u(d){t({animatedTitle:"Setting parent issue",payload:{parentId:d?d.id:null},optimisticUpdate(A){return{...A,parent:d||void 0}},rollbackUpdate(A){return{...A,parent:c}},successTitle:"Set parent issue",successMessage:d?`${d.identifier} set as parent issue`:`Removed parent issue from ${e.identifier}`,errorTitle:"Failed to set parent issue"})}return(0,ke.jsxs)(ke.Fragment,{children:[(0,ke.jsx)(nt.ActionPanel.Submenu,{title:o?"Change Parent Issue":"Set Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"i"},onOpen:()=>r(!0),children:!s&&a?(0,ke.jsx)(nt.Action,{title:"Loading\u2026"}):(s||[]).map(d=>(0,ke.jsx)(nt.Action,{autoFocus:d.id===n,title:`${d.identifier} - ${d.title}`,icon:Z(d.state),onAction:()=>u(d)},d.id))}),o?(0,ke.jsx)(nt.Action,{title:"Remove Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"k"},Windows:{modifiers:["ctrl","shift"],key:"k"}},onAction:()=>u(null)}):null]})}var at=require("@raycast/api"),ws=require("react");var lt=require("react/jsx-runtime");function ai({issue:e,updateIssue:t}){let[i,r]=(0,ws.useState)(!1),{projects:s,isLoadingProjects:a}=We(e.team.id,{execute:i});async function c(n){let o=e.project;t({animatedTitle:"Setting project",payload:{projectId:n?n.id:null},optimisticUpdate(u){return{...u,project:n||void 0}},rollbackUpdate(u){return{...u,project:o}},successTitle:n?"Set project":`Removed project from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set project"})}return(0,lt.jsxs)(at.ActionPanel.Submenu,{title:"Set Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"p"},onOpen:()=>r(!0),children:[(0,lt.jsx)(at.Action,{title:"No Project",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}},onAction:()=>c(null)}),!s&&a?(0,lt.jsx)(at.Action,{title:"Loading\u2026"}):(s||[]).map(n=>(0,lt.jsx)(at.Action,{autoFocus:n.id===e.project?.id,title:`${n.name} (${n.status.name})`,icon:pe(n),onAction:()=>c(n)},n.id))]})}var Ze=require("@raycast/api"),As=require("react");var xt=require("react/jsx-runtime");function li({issue:e,updateIssue:t}){let[i,r]=(0,As.useState)(!1),{states:s,isLoadingStates:a}=fe(e.team.id,{execute:i}),c=it(s||[]);async function n(o){let u=e.state;t({animatedTitle:"Setting status",payload:{stateId:o.id},optimisticUpdate(d){return{...d,state:o}},rollbackUpdate(d){return{...d,state:u}},successTitle:"Set status",successMessage:`${e.identifier} set to ${o.name}`,errorTitle:"Failed to set status"})}return(0,xt.jsx)(Ze.ActionPanel.Submenu,{icon:Ze.Icon.Circle,title:"Set Status",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},onOpen:()=>r(!0),children:c.length===0&&a?(0,xt.jsx)(Ze.Action,{title:"Loading\u2026"}):c.map(o=>(0,xt.jsx)(Ze.Action,{autoFocus:o.id===e.state.id,title:o.name,icon:Z(o),onAction:()=>n(o)},o.id))})}var w=require("react/jsx-runtime");function rt({issue:e,mutateList:t,mutateSubIssues:i,mutateDetail:r,showAttachmentsAction:s,attachments:a,priorities:c,me:n}){let{pop:o}=(0,I.useNavigation)(),{linearClient:u}=b(),d=e.assignee?.id===n?.id,A=tt({issueEstimationType:e.team.issueEstimationType,issueEstimationAllowZero:e.team.issueEstimationAllowZero,issueEstimationExtended:e.team.issueEstimationExtended});async function D({animatedTitle:h,payload:R,optimisticUpdate:M,rollbackUpdate:K,successTitle:De,successMessage:ve,errorTitle:Xe}){try{await(0,I.showToast)({style:I.Toast.Style.Animated,title:h});let ie=u.updateIssue(e.id,R);await Promise.all([ie,t?t(ie,{optimisticUpdate(q){if(q)return q.map(W=>W.id===e.id?M(W):W)},rollbackOnError(q){if(q)return q.map(W=>W.id===e.id?K(W):W)}}):Promise.resolve(),i?i(ie,{optimisticUpdate(q){if(q)return q.map(W=>W.id===e.id?M(W):W)},rollbackOnError(q){if(q)return q.map(W=>W.id===e.id?K(W):W)}}):Promise.resolve(),r?r(ie,{optimisticUpdate(q){return M(q)},rollbackOnError(q){return K(q)}}):Promise.resolve()]),await(0,I.showToast)({style:I.Toast.Style.Success,title:De,message:ve})}catch(ie){await(0,I.showToast)({style:I.Toast.Style.Failure,title:Xe,message:U(ie)})}}async function v(){if(await(0,I.confirmAlert)({title:"Delete Issue",message:"Are you sure you want to delete the selected issue?",icon:{source:I.Icon.Trash,tintColor:I.Color.Red}}))try{await(0,I.showToast)({style:I.Toast.Style.Animated,title:"Deleting issue"});let h=u.deleteIssue(e.id);r&&o(),await Promise.all([h,t?t(h,{optimisticUpdate(R){if(R)return R.filter(M=>M.id!==e.id)}}):Promise.resolve(),i?i(h,{optimisticUpdate(R){if(R)return R.filter(M=>M.id!==e.id)}}):Promise.resolve()]),await(0,I.showToast)({style:I.Toast.Style.Success,title:"Issue deleted",message:`"${e.title}" is deleted`})}catch(h){await(0,I.showToast)({style:I.Toast.Style.Failure,title:"Failed to delete issue",message:U(h)})}}async function x(h){let R=e.priority;D({animatedTitle:"Setting priority",payload:{priority:h.priority},optimisticUpdate(M){return{...M,priority:h.priority}},rollbackUpdate(M){return{...M,priority:R}},successTitle:"Set priority",successMessage:`${e.identifier} priority set to ${h.label}`,errorTitle:"Failed to set priority"})}async function $(h){let R=e.assignee;D({animatedTitle:"Setting assignee",payload:{assigneeId:h.id},optimisticUpdate(M){return{...M,assignee:h}},rollbackUpdate(M){return{...M,assignee:R}},successTitle:"Set assignee",successMessage:`${e.identifier} assigned to ${h.displayName}`,errorTitle:"Failed to set assignee"})}async function j(h){let R=e.assignee;D({animatedTitle:"Setting assignee",payload:{assigneeId:h?h.id:null},optimisticUpdate(M){return{...M,assignee:h||void 0}},rollbackUpdate(M){return{...M,assignee:R}},successTitle:"Set assignee",successMessage:`${e.identifier} ${h?"assigned to":"un-assigned from"} me`,errorTitle:"Failed to set assignee"})}async function p({estimate:h,label:R}){let M=e.estimate;D({animatedTitle:"Setting estimate",payload:{estimate:h},optimisticUpdate(K){return{...K,estimate:h}},rollbackUpdate(K){return{...K,estimate:M}},successTitle:"Set estimate",successMessage:`${e.identifier} estimate set to ${R}`,errorTitle:"Failed to set estimate"})}async function k(h){D({animatedTitle:h?"Setting due date":"Removing due date",payload:{dueDate:h},optimisticUpdate(R){return{...R,dueDate:h}},rollbackUpdate(R){return{...R,dueDate:R.dueDate}},successTitle:h?"Set due date":"Removed due date",successMessage:h?`${e.identifier} due date set to ${(0,ci.format)(h,"MM/dd/yyyy")}`:"",errorTitle:"Failed to set due date"})}async function S(h){if(!h){await(0,I.showToast)({style:I.Toast.Style.Failure,title:"Failed setting reminder"});return}try{await(0,I.showToast)({style:I.Toast.Style.Animated,title:"Setting reminder"}),await u.issueReminder(e.id,h),r&&o(),await(0,I.showToast)({style:I.Toast.Style.Success,title:"Reminder set",message:`${e.identifier} reminder set to ${(0,ci.format)(h,"MM/dd/yyyy")}`})}catch(R){await(0,I.showToast)({style:I.Toast.Style.Failure,title:"Failed to set reminder",message:U(R)})}}function F(){t&&t(),i&&i(),r&&r()}let[ce,te]=(0,Ls.useState)(""),{users:H,supportsUserTypeahead:Y,isLoadingUsers:ue}=Fe(ce);return(0,w.jsxs)(w.Fragment,{children:[(0,w.jsx)(Ae,{title:"Open Issue",url:e.url}),(0,w.jsxs)(I.ActionPanel.Section,{children:[(0,w.jsx)(I.Action.Push,{title:"Edit Issue",icon:I.Icon.Pencil,shortcut:I.Keyboard.Shortcut.Common.Edit,target:(0,w.jsx)(Bt,{priorities:c,me:n,issue:e,mutateList:t,mutateSubIssues:i})}),(0,w.jsx)(li,{issue:e,updateIssue:D}),c&&c.length>0?(0,w.jsx)(I.ActionPanel.Submenu,{icon:I.Icon.LevelMeter,title:"Set Priority",shortcut:{macOS:{modifiers:["cmd","opt"],key:"p"},Windows:{modifiers:["ctrl","alt"],key:"p"}},children:c.map(h=>(0,w.jsx)(I.Action,{autoFocus:h.priority===e.priority,title:h.label,icon:{source:me[h.priority]},onAction:()=>x(h)},h.priority))}):null,(0,w.jsx)(I.ActionPanel.Submenu,{icon:I.Icon.AddPerson,title:"Assign to",shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}},...Y&&{onSearchTextChange:te,isLoading:ue,throttle:!0},children:H?.map(h=>(0,w.jsx)(I.Action,{autoFocus:h.id===e.assignee?.id,title:`${h.displayName} (${h.email})`,icon:J(h),onAction:()=>$(h)},h.id))}),n?(0,w.jsx)(I.Action,{title:d?"Un-Assign from Me":"Assign to Me",icon:J(n),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}},onAction:()=>j(d?null:n)}):null,A?(0,w.jsx)(I.ActionPanel.Submenu,{title:"Set Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}},children:A.map(({estimate:h,label:R})=>(0,w.jsx)(I.Action,{autoFocus:h===e.estimate,title:R,onAction:()=>p({estimate:h,label:R})},h))}):null,(0,w.jsx)(I.Action.PickDate,{title:"Set Due Date",shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}},onChange:k}),(0,w.jsx)(I.Action.PickDate,{title:"Set Reminder",shortcut:{macOS:{modifiers:["cmd","shift"],key:"h"},Windows:{modifiers:["ctrl","shift"],key:"h"}},onChange:S}),(0,w.jsx)(ri,{issue:e,updateIssue:D}),(0,w.jsx)(si,{issue:e,updateIssue:D}),(0,w.jsx)(ai,{issue:e,updateIssue:D}),(0,w.jsx)(oi,{issue:e,updateIssue:D}),(0,w.jsx)(ni,{issue:e,updateIssue:D}),(0,w.jsx)(I.Action,{title:"Delete Issue",shortcut:I.Keyboard.Shortcut.Common.Remove,icon:I.Icon.Trash,style:I.Action.Style.Destructive,onAction:()=>v()})]}),(0,w.jsxs)(I.ActionPanel.Section,{children:[(0,w.jsx)(I.Action.Push,{title:"Show Sub-Issues",icon:I.Icon.List,target:(0,w.jsx)(ti,{issue:e,mutateList:t}),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}),(0,w.jsx)(I.Action.Push,{title:"Break Issues into Sub-Issues",icon:I.Icon.Stars,target:(0,w.jsx)(Wt,{issue:e}),shortcut:{macOS:{modifiers:["opt","shift"],key:"m"},Windows:{modifiers:["alt","shift"],key:"m"}}}),s?(0,w.jsx)(I.Action.Push,{title:"Show Issue Links",icon:I.Icon.Link,target:(0,w.jsx)(zt,{attachments:a??[],issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}}):null,(0,w.jsx)(I.Action.Push,{title:"Add Attachments and Links",icon:I.Icon.NewDocument,target:(0,w.jsx)($t,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,w.jsx)(I.Action.Push,{title:"Add Comment",icon:I.Icon.Plus,target:(0,w.jsx)(Qe,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"n"},Windows:{modifiers:["ctrl","alt","shift"],key:"n"}}}),(0,w.jsx)(I.Action.Push,{title:"Show Comments",icon:I.Icon.Bubble,target:(0,w.jsx)(Zt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"c"},Windows:{modifiers:["ctrl","alt","shift"],key:"c"}}})]}),(0,w.jsx)(ii,{issue:e}),(0,w.jsx)(I.ActionPanel.Section,{children:(0,w.jsx)(I.Action,{title:"Refresh",icon:I.Icon.ArrowClockwise,shortcut:I.Keyboard.Shortcut.Common.Refresh,onAction:()=>F()})})]})}var V=require("react/jsx-runtime");function _e({issue:e,mutateList:t,priorities:i,me:r}){let{issue:s,isLoadingIssue:a,mutateDetail:c}=Ee(e),n=`# ${s?.title}`;s?.description&&(n+=`

${s.description}`);let o=s?.cycle?Me(s.cycle):null,u=s.relations?s.relations.nodes.filter(D=>D.type=="related"):null,d=s.relations?s.relations.nodes.filter(D=>D.type=="duplicate"):null,A=s.attachments?.nodes.length??0;return(0,V.jsx)(O.Detail,{markdown:n,isLoading:a,...s?{metadata:(0,V.jsxs)(O.Detail.Metadata,{children:[(0,V.jsx)(O.Detail.Metadata.Label,{title:"Status",text:s.state.name,icon:Z(s.state)}),(0,V.jsx)(O.Detail.Metadata.Label,{title:"Priority",text:s.priorityLabel,icon:{source:me[s.priority]}}),(0,V.jsx)(O.Detail.Metadata.Label,{title:"Assignee",text:s.assignee?s.assignee.displayName:"Unassigned",icon:J(s.assignee)}),s.team.issueEstimationType!=="notUsed"?(0,V.jsx)(O.Detail.Metadata.Label,{title:"Estimate",text:Pt({estimate:s.estimate,issueEstimationType:s.team.issueEstimationType}),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}):null,s.labels.nodes.length>0?(0,V.jsx)(O.Detail.Metadata.TagList,{title:"Labels",children:s.labels.nodes.map(({id:D,name:v,color:x})=>(0,V.jsx)(O.Detail.Metadata.TagList.Item,{text:v,color:x},D))}):(0,V.jsx)(O.Detail.Metadata.Label,{title:"Labels",text:"No Labels"}),s.dueDate?(0,V.jsx)(O.Detail.Metadata.Label,{title:"Due Date",text:(0,Ts.format)(new Date(s.dueDate),"MM/dd/yyyy"),icon:bt(new Date(s.dueDate))}):null,A>0?(0,V.jsx)(O.Detail.Metadata.Label,{title:"Links",text:`${A>1?`${A} links`:"1 link"}`,icon:O.Icon.Link}):null,(0,V.jsx)(O.Detail.Metadata.Separator,{}),(0,V.jsx)(O.Detail.Metadata.Label,{title:"Cycle",text:o?o.title:"No Cycle",icon:{source:o?o.icon:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),(0,V.jsx)(O.Detail.Metadata.Label,{title:"Project",text:s.project?s.project.name:"No Project",icon:pe(s.project)}),(0,V.jsx)(O.Detail.Metadata.Label,{title:"Milestone",text:s.projectMilestone?s.projectMilestone.name:"No Milestone",icon:Pe(s.projectMilestone)}),(0,V.jsx)(O.Detail.Metadata.Label,{title:"Parent Issue",text:s.parent?s.parent.title:"No Issue",icon:s.parent?Z(s.parent.state):{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),u&&u.length>0?(0,V.jsx)(O.Detail.Metadata.TagList,{title:"Related",children:u.map(({id:D,relatedIssue:v})=>(0,V.jsx)(O.Detail.Metadata.TagList.Item,{text:v.identifier},D))}):null,d&&d.length>0?(0,V.jsx)(O.Detail.Metadata.TagList,{title:"Duplicates",children:d.map(({id:D,relatedIssue:v})=>(0,V.jsx)(O.Detail.Metadata.TagList.Item,{text:v.identifier},D))}):null]}),actions:(0,V.jsx)(O.ActionPanel,{children:(0,V.jsx)(rt,{issue:s,mutateList:t,mutateDetail:c,priorities:i,showAttachmentsAction:A>0,attachments:s.attachments?.nodes??[],me:r})})}:{}})}var ut=require("@raycast/api"),Rs=require("@raycast/utils"),jt=Ye(require("react"));var ct=require("react/jsx-runtime");function Ir({children:e}){return(0,jt.useEffect)(()=>{ns()},[]),e}var ui=class extends jt.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}render(){let{error:t}=this.state;if(!t)return this.props.children;if(!(t.message.includes("invalid_grant")||t.message.includes("Error while fetching tokens")||t.message.includes("Could not initialize OAuth")))throw t;return(0,ct.jsx)(ut.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${t.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,ct.jsx)(ut.ActionPanel,{children:(0,ct.jsx)(ut.Action,{title:"Sign in Again",onAction:async()=>{await Ot.client.removeTokens(),this.setState({error:null})}})})})}},yr=(0,Rs.withAccessToken)(Ot)(Ir);function di({children:e}){return(0,ct.jsx)(ui,{children:(0,ct.jsx)(yr,{children:e})})}var Mt=require("@raycast/api");function $s(e){return e?{source:e.name==="GitHub"?"bots/github.svg":e.name==="GitLab"?"bots/gitlab.svg":"linear-app-icon.png",mask:Mt.Image.Mask.Circle}:Mt.Icon.Person}var _=require("@raycast/api"),Ds=Ye(require("node-emoji"));function vs(e){let t=e.type;return e.reactionEmoji&&t.includes("Reaction")?Ds.get(e.reactionEmoji)??_.Icon.Emoji:(t==="issueStatusChanged"||t==="issueStatusChangedAll")&&e.issue?Z(e.issue.state):t.includes("Mention")?_.Icon.AtSymbol:t.includes("Comment")&&!t.includes("Reaction")?_.Icon.Bubble:t.includes("ThreadResolved")?_.Icon.CheckCircle:t.includes("Reminder")?_.Icon.Clock:t.includes("Assigned")?_.Icon.AddPerson:t.includes("Unassigned")?_.Icon.RemovePerson:t.includes("Created")||t.includes("AddedToView")?_.Icon.Plus:t.includes("Sla")?_.Icon.Warning:{issueAddedToTriage:{source:{light:"light/triage.svg",dark:"dark/triage.svg"}},triageResponsibilityIssueAddedToTriage:{source:{light:"light/triage.svg",dark:"dark/triage.svg"}},issuePriorityUrgent:{source:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"}},issueBlocking:_.Icon.ExclamationMark,issueUnblocked:_.Icon.Minus,issueMovedToProject:_.Icon.ArrowRight,issueDue:_.Icon.Calendar,issueSubscribed:_.Icon.Bell,oauthClientApprovalCreated:_.Icon.Download,projectUpdatePrompt:_.Icon.Heartbeat,system:_.Icon.SpeechBubble}[t]??_.Icon.Bell}function xs(e){if(e.url)return e.url;if(e.comment?.url)return e.comment.url;if(e.projectUpdate?.url)return e.projectUpdate.url;if(e.project?.url)return e.project.url;if(e.issue?.url)return e.issue.url}var Ms=require("@raycast/utils"),Us=require("lodash");async function js(){let{graphQLClient:e}=b(),{data:t}=await e.rawRequest(`
      query {
        notifications {
          nodes {
            id
            type
            createdAt
            readAt
            snoozedUntilAt
            title
            subtitle
            url
            actor {
              displayName
              avatarUrl
            }
            botActor {
              name
            }
            ... on IssueNotification {
              reactionEmoji
              comment {
                body
                url
              }
              issue {
                ${Ue}
              }
            }
            ... on ProjectNotification {
              project {
                url
                name
              }
              projectUpdate {
                url
              }
            }
          }
        }
        organization {
          urlKey
        }
      }
    `);return{notifications:t?.notifications.nodes,urlKey:t?.organization.urlKey}}function mi(){let{data:e,error:t,isLoading:i,mutate:r}=(0,Ms.useCachedPromise)(js),{notifications:s,urlKey:a}=e||{},c=new Date,[n,o]=(0,Us.chain)(s).filter(u=>!u.snoozedUntilAt||u.snoozedUntilAt<c).partition(u=>!!u.readAt).value();return{urlKey:a,readNotifications:n,unreadNotifications:o,notificationsError:t,isLoadingNotifications:!e&&!t||i,mutateNotifications:r}}var z=require("react/jsx-runtime");function hr(){let{urlKey:e,readNotifications:t,unreadNotifications:i,notificationsError:r,isLoadingNotifications:s,mutateNotifications:a}=mi(),{priorities:c,isLoadingPriorities:n}=It(),{me:o,isLoadingMe:u}=ze(),d=`https://linear.app/${e}/inbox`;r&&(0,f.showToast)({style:f.Toast.Style.Failure,title:"Failed to fetch latest notifications",message:U(r)});let A=[{title:"Unread",notifications:i},{title:"Read",notifications:t}];async function D(j){try{await(0,f.showToast)({style:f.Toast.Style.Animated,title:"Marking as read"}),await a(kt({id:j.id,readAt:new Date}),{optimisticUpdate(p){return p&&{...p,notifications:p?.notifications?.map(k=>k.id===j.id?{...k,readAt:new Date}:k)}},rollbackOnError(p){return p&&{...p,notifications:p?.notifications?.map(k=>k.id===j.id?{...k,readAt:j.readAt}:k)}},shouldRevalidateAfter:!0}),await(0,f.showToast)({style:f.Toast.Style.Success,title:"Marked as read"}),await(0,f.launchCommand)({name:"unread-notifications",type:f.LaunchType.Background})}catch(p){(0,f.showToast)({style:f.Toast.Style.Failure,title:"Failed to mark notification as read",message:U(p)})}}async function v(j){try{await(0,f.showToast)({style:f.Toast.Style.Animated,title:"Marking as unread"}),await a(kt({id:j.id,readAt:null}),{optimisticUpdate(p){return p&&{...p,notifications:p?.notifications?.map(k=>k.id===j.id?{...k,readAt:void 0}:k)}},rollbackOnError(p){return p&&{...p,notifications:p?.notifications?.map(k=>k.id===j.id?{...k,readAt:j.readAt}:k)}},shouldRevalidateAfter:!0}),await(0,f.showToast)({style:f.Toast.Style.Success,title:"Marked as unread"}),await(0,f.launchCommand)({name:"unread-notifications",type:f.LaunchType.Background})}catch(p){(0,f.showToast)({style:f.Toast.Style.Failure,title:"Failed to mark notification as unread",message:U(p)})}}async function x(j){try{await(0,f.showToast)({style:f.Toast.Style.Animated,title:"Deleting notification"}),await a(hi(j.id),{optimisticUpdate(p){return p&&{...p,notifications:p?.notifications?.filter(k=>k.id!==j.id)}},rollbackOnError(p){return p&&{...p,notifications:p?.notifications?.concat([j])}}}),await(0,f.showToast)({style:f.Toast.Style.Success,title:"Deleted notification"})}catch(p){(0,f.showToast)({style:f.Toast.Style.Failure,title:"Failed to delete notification",message:U(p)})}}async function $(){if(i.length===0){await(0,f.showToast)({style:f.Toast.Style.Success,title:"No unread notifications"});return}try{await(0,f.showToast)({style:f.Toast.Style.Animated,title:`Marking ${i.length} notification${i.length===1?"":"s"} as read`});let j=new Date;await a(Promise.all(i.map(p=>kt({id:p.id,readAt:j}))),{optimisticUpdate(p){return p&&{...p,notifications:p?.notifications?.map(k=>k.readAt?k:{...k,readAt:j})}},rollbackOnError(p){return p&&{...p,notifications:p?.notifications?.map(k=>{let S=i.find(F=>F.id===k.id);return S?{...k,readAt:S.readAt}:k})}},shouldRevalidateAfter:!0}),await(0,f.showToast)({style:f.Toast.Style.Success,title:"Marked all as read"}),await(0,f.launchCommand)({name:"unread-notifications",type:f.LaunchType.Background})}catch(j){(0,f.showToast)({style:f.Toast.Style.Failure,title:"Failed to mark all as read",message:U(j)})}}return(0,z.jsxs)(f.List,{isLoading:s||n||u,children:[(0,z.jsx)(f.List.EmptyView,{title:"Inbox",description:"You don't have any notifications."}),A.map(({title:j,notifications:p})=>{let k=p.length===1?"1 notification":`${p.length} notifications`;return(0,z.jsx)(f.List.Section,{title:j,subtitle:k,children:p.map(S=>{let F=new Date(S.createdAt),te=[(S.actor?S.actor.displayName:S.botActor?S.botActor.name:"Linear")||"Linear"];S.issue&&(te.push(...S.issue.identifier.split("-")),te.push(S.issue.title));let H=xs(S),Y=(R,M)=>{let K=R.length>M?"\u2026":"";return R.substring(0,M).trim()+K},ue=Y(S.title,60),h=Y(S.subtitle,80);return(0,z.jsx)(f.List.Item,{title:ue,subtitle:h,keywords:te,icon:S.actor?J(S.actor):S.botActor?$s(S.botActor):"linear-app-icon.png",accessories:[{date:F,tooltip:`${(0,Es.format)(F,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:vs(S)}],actions:(0,z.jsxs)(f.ActionPanel,{children:[S.readAt?(0,z.jsx)(f.Action,{title:"Mark as Unread",icon:f.Icon.Dot,onAction:()=>v(S),shortcut:{macOS:{modifiers:["cmd"],key:"u"},Windows:{modifiers:["ctrl"],key:"u"}}}):(0,z.jsx)(f.Action,{title:"Mark as Read",icon:f.Icon.Checkmark,onAction:()=>D(S),shortcut:{macOS:{modifiers:["cmd"],key:"u"},Windows:{modifiers:["ctrl"],key:"u"}}}),i.length>0?(0,z.jsx)(f.Action,{title:"Mark All as Read",icon:f.Icon.CheckCircle,shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}},onAction:$}):null,H?(0,z.jsx)(Ae,{url:H}):null,(0,z.jsxs)(f.ActionPanel.Section,{children:[S.issue?(0,z.jsx)(f.Action.Push,{title:"Open Issue in Raycast",target:(0,z.jsx)(_e,{issue:S.issue,priorities:c,me:o}),icon:f.Icon.RaycastLogoNeg,shortcut:f.Keyboard.Shortcut.Common.OpenWith}):null,e?(0,z.jsx)(Ae,{title:"Open Inbox",url:d,shortcut:f.Keyboard.Shortcut.Common.Open}):null,(0,z.jsx)(f.Action,{title:"Delete Notification",icon:f.Icon.Trash,style:f.Action.Style.Destructive,shortcut:f.Keyboard.Shortcut.Common.Remove,onAction:()=>x(S)})]}),H?(0,z.jsx)(f.ActionPanel.Section,{children:(0,z.jsx)(f.Action.CopyToClipboard,{icon:f.Icon.Clipboard,content:H,title:"Copy URL",shortcut:f.Keyboard.Shortcut.Common.CopyPath})}):null,(0,z.jsx)(f.ActionPanel.Section,{children:(0,z.jsx)(f.Action,{title:"Refresh",icon:f.Icon.ArrowClockwise,shortcut:f.Keyboard.Shortcut.Common.Refresh,onAction:()=>a()})})]})},S.id)})},j)})]})}function Fs(){return(0,z.jsx)(di,{children:(0,z.jsx)(hr,{})})}
