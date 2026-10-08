"use strict";var xi=Object.create;var Pt=Object.defineProperty;var vi=Object.getOwnPropertyDescriptor;var ji=Object.getOwnPropertyNames;var Mi=Object.getPrototypeOf,Ui=Object.prototype.hasOwnProperty;var Fi=(e,t)=>{for(var s in t)Pt(e,s,{get:t[s],enumerable:!0})},gs=(e,t,s,r)=>{if(t&&typeof t=="object"||typeof t=="function")for(let i of ji(t))!Ui.call(e,i)&&i!==s&&Pt(e,i,{get:()=>t[i],enumerable:!(r=vi(t,i))||r.enumerable});return e};var ct=(e,t,s)=>(s=e!=null?xi(Mi(e)):{},gs(t||!e||!e.__esModule?Pt(s,"default",{value:e,enumerable:!0}):s,e)),Ei=e=>gs(Pt({},"__esModule",{value:!0}),e);var mr={};Fi(mr,{default:()=>Di});module.exports=Ei(mr);var _e=require("@raycast/api");var hs=require("@raycast/api");var fs=require("@linear/sdk"),Is=require("@raycast/api"),ys=require("@raycast/utils"),dt=null;async function Ni(e,t,s,r,i){let c=JSON.stringify({query:s,variables:r}),a=new Headers(t.headers);new Headers(i).forEach((d,m)=>a.set(m,d)),a.set("Content-Type","application/json");let n=await fetch(e,{...t,method:"POST",headers:Object.fromEntries(a.entries()),body:c}),o=n.headers.get("Content-Type")?.startsWith("application/json")?await n.json():await n.text();if(typeof o!="string"&&n.ok&&!o.errors&&o.data)return{...o,headers:n.headers,status:n.status};throw new Error(typeof o=="string"?o:o.errors?.[0]?.message??`GraphQL Error (${n.status})`)}var Vt=ys.OAuthService.linear({scope:"read write",onAuthorize({token:e}){dt=new fs.LinearClient({accessToken:e,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":Is.environment.extensionName}});let t=dt.client;t.rawRequest=((s,r,i)=>Ni(t.url,t.options,s,r,i))}});function k(){if(!dt)throw new Error("No linear client initialized");return{linearClient:dt,graphQLClient:dt.client}}async function qt(e,t,s,r,i){let c=r,a=!0,n,o=0;for(;a&&o<i;){let d=await e(n);c=s(c,d),a=t(d)?.hasNextPage,n=t(d)?.endCursor,o++}return c}var Oi=(0,hs.getPreferenceValues)();function Wt({inFilterBlock:e,addComma:t,inParentheses:s}={inFilterBlock:!1,inParentheses:!1,addComma:!0}){return Oi.shouldHideRedundantIssues?[...s?["("]:[],...t?[", "]:[],...e?[]:["filter: { "],"completedAt: { null: true }, canceledAt: { null: true }",...e?[]:[" }"],...s?[")"]:[]].join(""):""}var Ke=`
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
`;async function Xe(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        issues(orderBy: createdAt${Wt()}) {
          nodes {
            ${Ke}
          }
        }
      }
    `);return t?.issues.nodes}async function ks(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        viewer {
          createdIssues(orderBy: updatedAt${Wt()}) {
            nodes {
              ${Ke}
            }
          }
        }
      }
    `);return t?.viewer.createdIssues.nodes}async function Ps(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          children${Wt({inParentheses:!0})} {
            nodes {
              ${Ke}
              sortOrder
            }
          }
        }
      }
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.children.nodes}async function Ss(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
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
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}async function bs(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
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
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue.comments.nodes}async function Cs(e){let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          ${Ke}
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
    `,{issueId:e});if(!s)throw new Error("Cannot find the Linear issue");return s.issue}var l=require("@raycast/api"),Ge=require("@raycast/utils"),Le=require("react");var ws=require("fs/promises"),Qt=ct(require("path"));var Vi="application/octet-stream",qi={".apng":"image/apng",".avif":"image/avif",".bmp":"image/bmp",".csv":"text/csv",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",".gif":"image/gif",".gz":"application/gzip",".heic":"image/heic",".heif":"image/heif",".ico":"image/x-icon",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json",".md":"text/markdown",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".pdf":"application/pdf",".png":"image/png",".ppt":"application/vnd.ms-powerpoint",".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",".svg":"image/svg+xml",".tar":"application/x-tar",".tif":"image/tiff",".tiff":"image/tiff",".txt":"text/plain",".webm":"video/webm",".webp":"image/webp",".xls":"application/vnd.ms-excel",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".zip":"application/zip"};function Wi(e){return qi[Qt.default.extname(e).toLowerCase()]??Vi}async function Qi(e){let{graphQLClient:t}=k(),s=await(0,ws.readFile)(e),r=Wi(e),i=Qt.default.basename(e),{data:c}=await t.rawRequest(`
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
    `,{size:s.byteLength,contentType:r,filename:i}),a=c?.fileUpload.uploadFile;if(!c?.fileUpload.success||!a)throw new Error(`Failed to request an upload URL for "${i}"`);let n=new Headers({"Content-Type":r,"Cache-Control":"public, max-age=31536000"});a.headers.forEach(({key:d,value:m})=>n.set(d,m));let o=await fetch(a.uploadUrl,{method:"PUT",headers:n,body:s});if(!o.ok)throw new Error(`Failed to upload "${i}": ${o.status} ${o.statusText}`);return{assetUrl:a.assetUrl,contentType:r,name:i}}async function St(e){let{linearClient:t}=k(),s=await Qi(e.url),r=await t.createAttachment({issueId:e.issueId,title:s.name,url:s.assetUrl});return{success:r.success,id:r.attachmentId}}async function bt(e){let{linearClient:t}=k(),s=await t.attachmentLinkURL(e.issueId,e.url);return{success:s.success,id:s.attachmentId}}async function As(e){let{graphQLClient:t}=k(),s=e.title.replace(/"/g,"\\$&"),r=e.description?.replace(/\n/g,"\\n")?.replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${r}", priority: ${e.priority}`;e.stateId&&(i+=`, stateId: "${e.stateId}"`),e.estimate&&(i+=`, estimate: ${e.estimate}`),e.assigneeId&&(i+=`, assigneeId: "${e.assigneeId}"`),e.labelIds&&e.labelIds.length>0&&(i+=`, labelIds: [${e.labelIds.map(a=>`"${a}"`).join(",")}]`),e.dueDate&&(i+=`, dueDate: "${e.dueDate.toISOString()}"`),e.cycleId&&(i+=`, cycleId: "${e.cycleId}"`),e.projectId&&(i+=`, projectId: "${e.projectId}"`),e.projectId&&e.projectMilestoneId&&(i+=`, projectMilestoneId: "${e.projectMilestoneId}"`),e.parentId&&(i+=`, parentId: "${e.parentId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
          issue {
            ${Ke}
          }
        }
      }
    `);return{success:c?.issueCreate.success,issue:c?.issueCreate.issue}}async function Ls(e){let{graphQLClient:t}=k(),s=e.title.replace(/"/g,"\\$&"),r=e.description?.replace(/\n/g,"\\n").replace(/"/g,"\\$&"),i=`teamId: "${e.teamId}", title: "${s}", description: "${r}", parentId: "${e.parentId}"`;e.stateId&&(i+=`, stateId: "${e.stateId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${i}}) {
          success
        }
      }
    `);return{success:c?.issueCreate.success}}var ne=require("date-fns"),Bi=10080*60*1e3;function ve(e){let t=Date.now(),s=Date.now()+Bi,r=new Date(e.startsAt),i=new Date(e.endsAt),c=!e.completedAt&&(0,ne.isBefore)(r,t)&&(0,ne.isAfter)(i,t),a=!e.completedAt&&(0,ne.isBefore)(r,s)&&(0,ne.isAfter)(i,s),n=c?{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}:{light:"light/cycle.svg",dark:"dark/cycle.svg"},o=`Cycle ${e.number} (${(0,ne.format)(r,"dd MMM")} - ${(0,ne.format)(i,"dd MMM")})`,d=c?`Active ${o}`:o;return{...e,isActive:c,isNext:a,icon:n,title:d}}function he(e){return e.filter(t=>(0,ne.isAfter)(new Date(t.endsAt),Date.now())).map(ve)}function q(e){return e instanceof Error?e.message:String(e)}var Ts={exponential:[0,1,2,4,8,16,32,64],fibonacci:[0,1,2,3,5,8,13,21],linear:[0,1,2,3,4,5,6,7],tShirt:[0,1,2,3,5,8,13,21]},$s={0:"\u2013",1:"XS",2:"S",3:"M",5:"L",8:"XL",13:"XXL",21:"XXXL"};function Ct({estimate:e,issueEstimationType:t}){if(!e)return"Not estimated";if(t==="tShirt"){let s=$s[e];return s||String(e)}return String(e)}function Je({issueEstimationType:e,issueEstimationAllowZero:t,issueEstimationExtended:s}){if(e==="notUsed")return null;let r=t?0:1,i=s?Ts[e].length:6,c=Ts[e].slice(r,i);return e==="tShirt"?c.map(a=>({estimate:a,label:$s[a]})):c.map(a=>({estimate:a,label:a!==1?`${a} points`:`${a} point`}))}function Bt(e={}){return{title:"",description:"",stateId:"",priority:"",assigneeId:"",labelIds:[],estimate:"",dueDate:null,cycleId:"",projectId:"",milestoneId:"",...e}}function zi(e){if(typeof e=="string")try{let t=JSON.parse(e);return typeof t=="object"&&t!==null?t:{}}catch{return{}}return typeof e=="object"&&e!==null?e:{}}function ke(e){return typeof e=="string"?e:void 0}function Ds(e){return typeof e=="number"?String(e):ke(e)}function Rs(e){if(!Array.isArray(e))return;let t=e.filter(s=>typeof s=="string");return t.length>0?t:void 0}function Gi(e){if(typeof e!="string")return;let t=new Date(e);return Number.isNaN(t.getTime())?void 0:t}function xs(e,t={}){let s=zi(e.templateData),r=Bt(t),i=Rs(s.labelIds)??Rs(s.labels);return{title:ke(s.title)??r.title,description:ke(s.description)??r.description,stateId:ke(s.stateId)??ke(s.statusId)??r.stateId,priority:Ds(s.priority)??r.priority,assigneeId:ke(s.assigneeId)??r.assigneeId,labelIds:i??r.labelIds,estimate:Ds(s.estimate)??r.estimate,dueDate:s.dueDate!==void 0?Gi(s.dueDate)??null:r.dueDate,cycleId:ke(s.cycleId)??r.cycleId,projectId:ke(s.projectId)??r.projectId,milestoneId:r.milestoneId}}function wt(e){let t=e.split(`
`),s=/https?:\/\/\S+/,r=t.map(i=>i.trim()).filter(i=>s.test(i));return Array.from(new Set(r))}var zt=require("@raycast/api");function Pe(e){return e?{source:"linear-icons/milestone.svg",tintColor:zt.Color.PrimaryText}:{source:"linear-icons/no-milestone.svg",tintColor:zt.Color.SecondaryText}}var ae={0:{light:"light/priority-no-priority.svg",dark:"dark/priority-no-priority.svg"},1:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"},2:{light:"light/priority-high.svg",dark:"dark/priority-high.svg"},3:{light:"light/priority-medium.svg",dark:"dark/priority-medium.svg"},4:{light:"light/priority-low.svg",dark:"dark/priority-low.svg"}};var vs=ct(require("fs")),js=require("@raycast/api"),Ms=ct(require("node-emoji"));function At({icon:e,color:t,fallbackIcon:s}){if(!e)return s;if(/:(.*):/.test(e))return Ms.get(e)??s;let i=`${js.environment.assetsPath}/linear-icons/${e.toLowerCase()}.svg`;return vs.default.existsSync(i)?{source:i,...t?{tintColor:{light:t,dark:t,adjustContrast:!0}}:{}}:s}function le(e){return e?At({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var Us=require("lodash");var _i={triage:{light:"light/triage.svg",dark:"dark/triage.svg"},backlog:{light:"light/backlog.svg",dark:"dark/backlog.svg"},unstarted:{light:"light/unstarted.svg",dark:"dark/unstarted.svg"},started:{light:"light/started.svg",dark:"dark/started.svg"},completed:{light:"light/completed.svg",dark:"dark/completed.svg"},canceled:{light:"light/canceled.svg",dark:"dark/canceled.svg"}};function G(e){return{source:_i[e.type],tintColor:{light:e.color,dark:e.color,adjustContrast:!0}}}function Se(e,t=["triage","backlog","unstarted","started","completed","canceled"]){if(e.length===0)return[];let s=(0,Us.groupBy)(e,r=>r.type);return t.filter(r=>!!s[r]).map(r=>s[r]).flat()}var Fs=require("@raycast/api");function Lt(e,t){let s=t?.logoUrl?encodeURI(t.logoUrl):Fs.Icon.TwoPeople;return At({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:s})}var Tt=require("@raycast/api"),Es=require("@raycast/utils");function H(e){return e?{source:e.avatarUrl?encodeURI(e.avatarUrl):(0,Es.getAvatarIcon)(e.displayName.toUpperCase()),mask:Tt.Image.Mask.Circle}:Tt.Icon.Person}var Ns=require("@raycast/utils");function je(e,t){let{linearClient:s}=k(),{data:r,error:i,isLoading:c}=(0,Ns.useCachedPromise)(async a=>(await s.cycles({filter:{team:{id:{eq:a}}}})).nodes.sort((o,d)=>o.number-d.number),[e],{execute:t?.execute!==!1&&!!e});return{cycles:r,cyclesError:i,isLoadingCycles:!r&&!i||c}}var qs=require("@raycast/utils");var Os=`
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
`;function Zi(e,t){let s=e.type.toLowerCase()==="issue",r=!e.team||e.team.id===t;return s&&!e.archivedAt&&r}function Hi(e,t){return(e.sortOrder??0)-(t.sortOrder??0)||e.name.localeCompare(t.name)}async function Vs(e){if(!e)return[];let{graphQLClient:t}=k(),{data:s}=await t.rawRequest(`
      query IssueTemplates($teamId: String!, $first: Int) {
        organization {
          templates(first: $first) {
            nodes {
              ${Os}
            }
          }
        }
        team(id: $teamId) {
          templates(first: $first) {
            nodes {
              ${Os}
            }
          }
        }
      }
    `,{teamId:e,first:100});return[...s?.organization?.templates?.nodes??[],...s?.team?.templates?.nodes??[]].filter((i,c,a)=>a.findIndex(n=>n.id===i.id)===c).filter(i=>Zi(i,e)).sort(Hi)}function Gt(e,t){let{data:s,error:r,isLoading:i}=(0,qs.useCachedPromise)(Vs,[e],{execute:t?.execute!==!1&&!!e});return{issueTemplates:s,issueTemplatesError:r,isLoadingIssueTemplates:!s&&!r||i}}var Ws=require("@raycast/utils");function J(e,t=[],s){let{data:r,error:i,isLoading:c,mutate:a}=(0,Ws.useCachedPromise)(e,t,s);return{issues:r,issuesError:i,isLoadingIssues:c,mutateList:a}}var zs=require("@raycast/utils");var Qs=require("@raycast/api");var Ki=100,Xi=100,Ji=(0,Qs.getPreferenceValues)();function Yi(){let e=Number(Ji.labelsLimit),t=Number.isFinite(e)&&e>0?e:Xi,s=Math.floor(Math.min(Ki,t)),r=Math.ceil(t/s);return{pageSize:s,pageLimit:r}}async function Bs(e){if(!e)return[];let{pageSize:t,pageLimit:s}=Yi(),{graphQLClient:r}=k();return qt(async i=>r.rawRequest(`
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
        `,{teamId:e,cursor:i}),i=>i.data?.team?.labels?.pageInfo,(i,c)=>i.concat(c.data?.team?.labels?.nodes??[]),[],s)}function Me(e,t){let{data:s,error:r,isLoading:i}=(0,zs.useCachedPromise)(Bs,[e],{execute:t?.execute!==!1&&!!e});return{labels:s,labelsError:r,isLoadingLabels:!s&&!r||i}}var _s=require("@raycast/utils");var er=`
  id
  name
  targetDate
  project {
      id
  }
  sortOrder
  updatedAt
`;async function Gs(e){let{graphQLClient:t}=k();if(e){let{data:s}=await t.rawRequest(`
        query($projectId: String!) {
          project(id: $projectId) {
            projectMilestones {
              nodes {
                ${er}
              }
            }
          }
        }
      `,{projectId:e});return s?.project.projectMilestones.nodes}return null}function Ue(e,t){let{data:s,error:r,isLoading:i,mutate:c}=(0,_s.useCachedPromise)(Gs,[e],{execute:t?.execute!==!1});return{milestones:s,isLoadingMilestones:!s&&!r||i,milestonesError:r,mutateMilestones:c}}var Hs=require("@raycast/utils");var tr=`
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
`;async function Zs({teamId:e,searchText:t="",after:s=null,first:r=null}){let{graphQLClient:i}=k(),c=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${tr}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;if(!e){let{data:o}=await i.rawRequest(`
        query($first: Int, $after: String, $searchText: String) {
          ${c}
        }
      `,{first:r,after:s,searchText:t}),d=o?.projects;return{data:d?.nodes??[],hasMore:!!d?.pageInfo.hasNextPage,cursor:d?.pageInfo.endCursor||null}}let{data:a}=await i.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${c}
        }
      }
    `,{teamId:e,first:r,after:s,searchText:t}),n=a?.team?.projects;return{data:n?.nodes??[],hasMore:!!n?.pageInfo.hasNextPage,cursor:n?.pageInfo.endCursor||null}}function Fe(e,t){let{data:s,error:r,isLoading:i,mutate:c,pagination:a}=(0,Hs.useCachedPromise)((n,o)=>d=>Zs({teamId:n,searchText:o,after:d.cursor,first:t?.pageSize}),[e,t?.searchText],{execute:t?.execute!==!1,keepPreviousData:!0});return{projects:s,isLoadingProjects:!s&&!r||i,projectsError:r,mutateProjects:c,pagination:a}}var Ks=require("@raycast/utils");function me(e,t){let{linearClient:s}=k(),{data:r,error:i,isLoading:c}=(0,Ks.useCachedPromise)(async a=>(await s.workflowStates({filter:{team:{id:{eq:a}}}})).nodes.sort((o,d)=>o.position-d.position),[e],{initialData:[],execute:t?.execute!==!1});return{states:r,isLoadingStates:c,statesError:i}}var Ys=require("@raycast/utils");var Xs=require("lodash");async function Js(e=""){let{graphQLClient:t,linearClient:s}=k(),r=await s.viewer,{data:i}=await t.rawRequest(`
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
    `,{userId:r.id,query:e}),c=(0,Xs.sortBy)(i?.teams.nodes??[],o=>o.membership?.sortOrder??1/0),a=i?.organization,n=!!i?.teams.pageInfo.hasNextPage;return{teams:c,organization:a,hasMoreTeams:n}}function ut(e=""){let{data:t,error:s,isLoading:r}=(0,Ys.useCachedPromise)(Js,[e]);return{teams:t?.teams,org:t?.organization,teamsError:s,isLoadingTeams:!t&&!s||r,supportsTeamTypeahead:e.trim().length>0||t?.hasMoreTeams}}var ei=require("@raycast/utils");function Ee(e=""){let{linearClient:t}=k(),{data:s,error:r,isLoading:i}=(0,ei.useCachedPromise)(async c=>{let a=await t.users(c.trim().length>0?{filter:{name:{containsIgnoreCase:c}}}:void 0);return{users:a?.nodes??[],hasMoreUsers:!!a?.pageInfo?.hasNextPage}},[e],{initialData:[]});return{users:s?.users,supportsUserTypeahead:e.trim().length>0||s?.hasMoreUsers,usersError:r,isLoadingUsers:!s&&!r||i}}var M=require("@raycast/api"),Li=require("date-fns");var Ye=require("@raycast/api"),$t=require("date-fns");function Dt(e){let t=(0,$t.differenceInDays)(e,(0,$t.startOfToday)()),s=Ye.Color.PrimaryText;return t<=7&&(s=Ye.Color.Orange),t<=0&&(s=Ye.Color.Red),{source:Ye.Icon.Calendar,tintColor:s}}var ti=require("@raycast/utils");function Ne(e){let t=e.id,{data:s,error:r,isLoading:i,mutate:c}=(0,ti.useCachedPromise)(Cs,[t],{initialData:{...e,description:""}});return{issue:s,issueError:r,isLoadingIssue:i,mutateDetail:c}}var g=require("@raycast/api"),cs=require("date-fns"),Ai=require("react");var C=require("@raycast/api"),si=require("@raycast/utils"),ii=require("nanoid"),Oe=require("react");var Y=require("react/jsx-runtime");function _t({issue:e}){let{pop:t}=(0,C.useNavigation)(),{states:s}=me(e.team.id),r=(0,Oe.useMemo)(()=>s.filter(w=>w.type==="unstarted")[0],[s]),{issue:i,isLoadingIssue:c}=Ne(e),{data:a,isLoading:n,revalidate:o}=(0,si.useAI)(`Act as a product manager for Linear issues. Break down a Linear issue into a list of sub-issues. 
    
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

Break down the Linear issue with this title: "${i.title}"`,{execute:!!i&&!c,creativity:.5}),[d,m]=(0,Oe.useState)(!1),[b,L]=(0,Oe.useState)([]);(0,Oe.useEffect)(()=>{if(!(!a||n)){try{let $=/\[[\s\S]*?\]/,w=a.match($);if(w&&w[0]){let K=JSON.parse(w[0]);L(K.map(U=>({...U,id:(0,ii.nanoid)(),selected:!0})))}}catch($){(0,C.showToast)({style:C.Toast.Style.Failure,title:"Failed to parse AI results",message:q($),primaryAction:{title:"Retry",onAction:o},secondaryAction:{title:"Copy AI Result",onAction:()=>C.Clipboard.copy(a)}})}m(!0)}},[a,n]);async function T(){try{await(0,C.showToast)({style:C.Toast.Style.Animated,title:"Creating sub-issues"});let $=b.filter(w=>w.selected);await Promise.all($.map(w=>Ls({teamId:i.team.id,title:w.title,description:w.description,parentId:i.id,stateId:r?.id}))),await(0,C.showToast)({style:C.Toast.Style.Success,title:"Created sub-issues"}),t()}catch($){(0,C.showToast)({style:C.Toast.Style.Failure,title:"Failed to create Sub-Issues",message:q($)})}}return(0,Y.jsxs)(C.List,{isLoading:n||!d,children:[b?.map($=>(0,Y.jsx)(C.List.Item,{icon:$.selected?{source:C.Icon.CheckCircle,tintColor:C.Color.Green}:C.Icon.Circle,title:$.title,subtitle:$.description,actions:(0,Y.jsxs)(C.ActionPanel,{children:[(0,Y.jsx)(C.Action,{title:$.selected?"Unselect Sub-Issue":"Select Sub-Issue",icon:$.selected?C.Icon.Circle:{source:C.Icon.CheckCircle,tintColor:C.Color.Green},onAction:()=>L(b.map(w=>w.id===$.id?{...w,selected:!w.selected}:w))}),(0,Y.jsx)(C.Action,{title:"Create Sub-Issues",icon:C.Icon.Plus,onAction:()=>T()}),(0,Y.jsx)(C.Action,{title:"Generate New Sub-Issues",icon:C.Icon.ArrowClockwise,onAction:o})]})},$.title)),(0,Y.jsx)(C.List.EmptyView,{title:"No sub-issues were generated. Try again.",actions:(0,Y.jsx)(C.ActionPanel,{children:(0,Y.jsx)(C.Action,{title:"Retry",icon:C.Icon.ArrowClockwise,onAction:o})})})]})}var y=require("@raycast/api"),Ve=require("@raycast/utils"),mt=require("react");async function ri(e,t){let{graphQLClient:s}=k(),r=[];if(t.teamId&&r.push(`teamId: "${t.teamId}"`),t.title&&r.push(`title: "${t.title.replace(/"/g,"\\$&")}"`),t.description&&r.push(`description: "${t.description.replace(/\n/g,"\\n").replace(/"/g,"\\$&")}"`),t.stateId&&r.push(`stateId: "${t.stateId}"`),typeof t.priority<"u"&&r.push(`priority: ${t.priority}`),typeof t.assigneeId<"u"&&r.push(`assigneeId: ${t.assigneeId?`"${t.assigneeId}"`:null}`),t.labelIds&&r.push(`labelIds: [${t.labelIds.map(c=>`"${c}"`).join(",")}]`),typeof t.estimate<"u"&&r.push(`estimate: ${t.estimate}`),typeof t.dueDate<"u"){let c=t.dueDate?t.dueDate instanceof Date?t.dueDate.toISOString():t.dueDate:null;r.push(`dueDate: ${c?`"${c}"`:null}`)}typeof t.cycleId<"u"&&r.push(`cycleId: ${t.cycleId?`"${t.cycleId}"`:null}`),typeof t.projectId<"u"&&r.push(`projectId: ${t.projectId?`"${t.projectId}"`:null}`),typeof t.projectMilestoneId<"u"&&r.push(`projectMilestoneId: ${t.projectMilestoneId?`"${t.projectMilestoneId}"`:null}`),typeof t.parentId<"u"&&r.push(`parentId: ${t.parentId?`"${t.parentId}"`:null}`);let{data:i}=await s.rawRequest(`
      mutation {
        issueUpdate(id: "${e}", input: {${r.join(", ")}}) {
          success
        }
      }
    `);return{success:i?.issueUpdate.success}}var S=require("react/jsx-runtime");function Zt(e){let{pop:t}=(0,y.useNavigation)(),{issue:s,isLoadingIssue:r,mutateDetail:i}=Ne(e.issue),[c,a]=(0,mt.useState)(""),{teams:n,org:o,supportsTeamTypeahead:d,isLoadingTeams:m}=ut(c),b=n&&n.length>1,[L,T]=(0,mt.useState)(""),{users:$,supportsUserTypeahead:w,isLoadingUsers:K}=Ee(L),{handleSubmit:U,itemProps:D,values:v,setValue:W}=(0,Ve.useForm)({async onSubmit(p){let Z=await(0,y.showToast)({style:y.Toast.Style.Animated,title:"Editing issue"});try{let ue={teamId:p.teamId||e.issue.team.id,title:p.title,description:p.description,stateId:p.stateId,labelIds:p.labelIds,dueDate:p.dueDate,...B&&p.estimate?{estimate:parseInt(p.estimate)}:{},...p.assigneeId?{assigneeId:p.assigneeId}:{},...p.cycleId?{cycleId:p.cycleId}:{},...p.projectId?{projectId:p.projectId}:{},...p.milestoneId?{projectMilestoneId:p.milestoneId}:{},...p.parentId?{parentId:p.parentId}:{},priority:parseInt(p.priority)},{success:lt}=await ri(s.id,ue);lt&&(Z.style=y.Toast.Style.Success,Z.title=`Edited Issue \u2022 ${s.identifier}`,t(),i(),e.mutateList&&e.mutateList(),e.mutateSubIssues&&e.mutateSubIssues())}catch(ue){Z.style=y.Toast.Style.Failure,Z.title="Failed to edit issue",Z.message=q(ue)}},validation:{teamId:b?Ve.FormValidation.Required:void 0,title:Ve.FormValidation.Required,stateId:Ve.FormValidation.Required,priority:Ve.FormValidation.Required},initialValues:{teamId:e.issue.team.id,title:e.issue.title,description:s.description??void 0,priority:String(e.issue.priority),stateId:e.issue.state.id,estimate:e.issue.estimate?String(e.issue.estimate):void 0,assigneeId:e.issue.assignee?.id,labelIds:e.issue.labels.nodes.map(p=>p.id),dueDate:s.dueDate?new Date(s.dueDate):null,cycleId:e.issue.cycle?.id,projectId:e.issue.project?.id,milestoneId:e.issue.projectMilestone?.id,parentId:e.issue.parent?.id}});(0,mt.useEffect)(()=>{W("description",s.description||""),W("dueDate",s.dueDate?new Date(s.dueDate):null)},[s]);let de=!!v.teamId&&v.teamId.trim().length>0,{states:Te}=me(v.teamId,{execute:de}),{labels:_}=Me(v.teamId,{execute:de}),{cycles:oe}=je(v.teamId,{execute:de}),{issues:Ie}=J(Xe,[],{execute:de}),{projects:I}=Fe(v.teamId,{execute:de}),{milestones:A}=Ue(v.projectId,{execute:!!v.projectId}),R=n?.find(p=>p.id===v.teamId),B=R?Je({issueEstimationType:R.issueEstimationType,issueEstimationAllowZero:R.issueEstimationAllowZero,issueEstimationExtended:R.issueEstimationExtended}):null,$e=Se(Te||[]),De=Te&&Te.length>0,Ze=e.priorities&&e.priorities.length>0,X=_&&_.length>0,E=oe&&oe.length>0,N=I&&I.length>0,Ft=A&&A.length>0,kt=Ie&&Ie.length>0;return(0,S.jsxs)(y.Form,{actions:(0,S.jsx)(y.ActionPanel,{children:(0,S.jsx)(y.Action.SubmitForm,{onSubmit:U,title:"Edit Issue"})}),isLoading:m||r||K,children:[(d||b)&&(0,S.jsxs)(S.Fragment,{children:[(0,S.jsx)(y.Form.Dropdown,{title:"Team",...D.teamId,...d&&{onSearchTextChange:a,isLoading:m,throttle:!0},children:n?.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:Lt(p,o)},p.id))}),(0,S.jsx)(y.Form.Separator,{})]}),(0,S.jsx)(y.Form.TextField,{title:"Title",placeholder:"Issue title",autoFocus:!0,...D.title}),(0,S.jsx)(y.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...D.description}),(0,S.jsx)(y.Form.Dropdown,{title:"Status",...D.stateId,children:De?$e.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:G(p)},p.id)):null}),(0,S.jsx)(y.Form.Dropdown,{title:"Priority",...D.priority,children:Ze?e.priorities?.map(({priority:p,label:Z})=>(0,S.jsx)(y.Form.Dropdown.Item,{title:Z,value:String(p),icon:{source:ae[p]}},p)):null}),(0,S.jsxs)(y.Form.Dropdown,{title:"Assignee",...D.assigneeId,...w&&{onSearchTextChange:T,isLoading:K,throttle:!0},children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:y.Icon.Person}),$?.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.name,value:p.id,icon:H(p)},p.id))]}),(0,S.jsx)(y.Form.TagPicker,{title:"Labels",...D.labelIds,placeholder:"Add label",children:X?_.map(({id:p,name:Z,color:ue})=>(0,S.jsx)(y.Form.TagPicker.Item,{title:Z,value:p,icon:{source:y.Icon.Dot,tintColor:ue}},p)):null}),B?(0,S.jsxs)(y.Form.Dropdown,{title:"Estimate",...D.estimate,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),B.map(({estimate:p,label:Z})=>(0,S.jsx)(y.Form.Dropdown.Item,{title:Z,value:String(p),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},p))]}):null,(0,S.jsx)(y.Form.DatePicker,{title:"Due Date",type:y.Form.DatePicker.Type.Date,...D.dueDate}),E||N||kt?(0,S.jsx)(y.Form.Separator,{}):null,E?(0,S.jsxs)(y.Form.Dropdown,{title:"Cycle",...D.cycleId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),he(oe).map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:p.title,value:p.id,icon:{source:p.icon}},p.id))]}):null,N?(0,S.jsxs)(y.Form.Dropdown,{title:"Project",...D.projectId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),I.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:`${p.name} (${p.status.name})`,value:p.id,icon:le(p)},p.id))]}):null,Ft?(0,S.jsxs)(y.Form.Dropdown,{title:"Milestone",storeValue:!0,...D.milestoneId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),A.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:`${p.name}  (${p.targetDate||"No Target Date"})`,value:p.id,icon:Pe(p)},p.id))]}):null,kt?(0,S.jsxs)(y.Form.Dropdown,{title:"Parent",...D.parentId,children:[(0,S.jsx)(y.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),Ie.map(p=>(0,S.jsx)(y.Form.Dropdown.Item,{title:`${p.identifier} - ${p.title}`,value:p.id,icon:G(p.state)},p.id))]}):null]})}var ee=require("@raycast/api"),ni=require("date-fns");var O=require("@raycast/api"),oi=require("@raycast/utils");var be=require("react/jsx-runtime");function Rt({issue:{id:e,title:t,identifier:s}}){let{pop:r}=(0,O.useNavigation)(),{reset:i,itemProps:c,handleSubmit:a}=(0,oi.useForm)({onSubmit:async n=>{let o=await(0,O.showToast)({style:O.Toast.Style.Animated,title:"Attaching links"}),d=wt(n.links);if(d.length===0&&n.attachments.length===0){o.style=O.Toast.Style.Failure,o.title="No links or attachments provided";return}if(d.length>0){let m=d.length===1?"link":"links";try{await Promise.all(d.map(b=>bt({issueId:e,url:b}))),o.style=O.Toast.Style.Success,o.title=`Successfully attached ${m}`}catch(b){o.style=O.Toast.Style.Failure,o.title=`Failed attaching ${m}`,o.message=q(b)}}if(n.attachments.length>0){let m=n.attachments.length===1?"attachment":"attachments";try{o.style=O.Toast.Style.Animated,o.title=`Uploading ${m}\u2026`,await Promise.all(n.attachments.map(b=>St({issueId:e,url:b}))),o.style=O.Toast.Style.Success,o.title=`Successfully uploaded ${m}`}catch(b){o.style=O.Toast.Style.Failure,o.title=`Failed uploading ${m}`,o.message=q(b)}}i({attachments:[],links:""}),r()},initialValues:{links:""}});return(0,be.jsxs)(O.Form,{actions:(0,be.jsx)(O.ActionPanel,{children:(0,be.jsx)(O.Action.SubmitForm,{onSubmit:a,icon:O.Icon.NewDocument,title:"Attach"})}),navigationTitle:"Add Attachments and Links",children:[(0,be.jsx)(O.Form.Description,{title:"Issue",text:`[${s}] ${t}`}),(0,be.jsx)(O.Form.FilePicker,{title:"Attachment",...c.attachments}),(0,be.jsx)(O.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...c.links})]})}var Ce=require("react/jsx-runtime");function Ht({attachments:e,issue:t}){return(0,Ce.jsx)(ee.List,{navigationTitle:`Links for ${t.identifier}`,children:e.map(s=>{let r=new Date(s.updatedAt);return(0,Ce.jsx)(ee.List.Item,{icon:s.source?.imageUrl??ee.Icon.Link,title:s.title,subtitle:s.subtitle,accessories:[{date:r,tooltip:`Updated: ${(0,ni.format)(r,"EEEE d MMMM yyyy 'at' HH:mm")}`}],actions:(0,Ce.jsxs)(ee.ActionPanel,{children:[(0,Ce.jsx)(ee.Action.OpenInBrowser,{url:s.url}),(0,Ce.jsx)(ee.Action.Push,{title:"Add Attachments and Links",icon:ee.Icon.NewDocument,target:(0,Ce.jsx)(Rt,{issue:t})})]})},s.id)})})}var Q=require("@raycast/api"),ai=require("react");var pt=require("react/jsx-runtime");function qe({comment:e,issue:t,mutateComments:s}){let{linearClient:r}=k(),{pop:i}=(0,Q.useNavigation)(),[c,a]=(0,ai.useState)(e?e.body:"");async function n(){await(0,Q.showToast)({style:Q.Toast.Style.Animated,title:`${e?"Updating":"Adding"} comment`});try{e?await r.updateComment(e.id,{body:c}):await r.createComment({body:c,issueId:t.id}),await(0,Q.showToast)({style:Q.Toast.Style.Success,title:`${e?"Updated":"Added"} comment`}),i(),s&&s()}catch(o){(0,Q.showToast)({style:Q.Toast.Style.Failure,title:`Failed to ${e?"update":"add"} comment`,message:q(o)})}}return(0,pt.jsx)(Q.Form,{actions:(0,pt.jsx)(Q.ActionPanel,{children:(0,pt.jsx)(Q.Action.SubmitForm,{title:e?"Edit Comment":"Add Comment",onSubmit:n,icon:e?Q.Icon.Pencil:Q.Icon.Plus})}),children:(0,pt.jsx)(Q.Form.TextArea,{id:"comment",title:"Comment",placeholder:"Leave a comment",value:c,onChange:a})})}var h=require("@raycast/api"),mi=require("date-fns"),pi=ct(require("remove-markdown"));var li=require("@raycast/utils");function Kt(e){let{data:t,error:s,isLoading:r,mutate:i}=(0,li.useCachedPromise)(bs,[e]);return{comments:t,commentsError:s,isLoadingComments:r,mutateComments:i}}var ci=require("@raycast/utils");function We(){let{linearClient:e}=k(),{data:t,error:s,isLoading:r}=(0,ci.useCachedPromise)(()=>e.viewer);return{me:t,meError:s,isLoadingMe:!t&&!s||r}}var Jt=require("@raycast/api");var di=require("@raycast/api"),Xt=!1;async function ui(){Xt=!!(await(0,di.getApplications)()).find(s=>s.bundleId==="com.linear")}var Yt=require("react/jsx-runtime");function gt({title:e,url:t,...s}){return Xt?(0,Yt.jsx)(Jt.Action.Open,{title:`${e||"Open"} in Linear`,icon:"linear-app-icon.png",target:t,application:"Linear",...s}):(0,Yt.jsx)(Jt.Action.OpenInBrowser,{url:t,title:`${e||"Open"} in Browser`})}var V=require("react/jsx-runtime");function es({issue:e}){let{linearClient:t}=k(),{me:s,isLoadingMe:r}=We(),{comments:i,isLoadingComments:c,mutateComments:a}=Kt(e.id);async function n(o){if(await(0,h.confirmAlert)({title:"Delete Comment",message:"Are you sure you want to delete this comment?",icon:{source:h.Icon.Trash,tintColor:h.Color.Red}}))try{await(0,h.showToast)({style:h.Toast.Style.Animated,title:"Deleting comment"}),await a(t.deleteComment(o),{optimisticUpdate(d){return d&&d?.filter(m=>m.id!==o)}}),await(0,h.showToast)({style:h.Toast.Style.Success,title:"Deleted comment"})}catch(d){(0,h.showToast)({style:h.Toast.Style.Failure,title:"Failed to delete comment",message:q(d)})}}return(0,V.jsxs)(h.List,{isLoading:c||r,navigationTitle:`${e.identifier} \u2022 Comments`,searchBarPlaceholder:"Filter by user or comment content",isShowingDetail:!0,children:[(0,V.jsx)(h.List.EmptyView,{title:"No comments",description:"This issue doesn't have any comments.",actions:(0,V.jsx)(h.ActionPanel,{children:(0,V.jsx)(h.Action.Push,{title:"Add Comment",icon:h.Icon.Plus,target:(0,V.jsx)(qe,{issue:e,mutateComments:a})})})}),i?.map(o=>{let d=new Date(o.createdAt);return(0,V.jsx)(h.List.Item,{title:o.user.displayName,subtitle:o.body,icon:H(o.user),keywords:(0,pi.default)(o.body).replace(/\n/g," ").split(" "),accessories:[{date:d,tooltip:`Created: ${(0,mi.format)(d,"EEEE d MMMM yyyy 'at' HH:mm")}`}],detail:(0,V.jsx)(h.List.Item.Detail,{markdown:o.body}),actions:(0,V.jsxs)(h.ActionPanel,{children:[(0,V.jsx)(gt,{title:"Open Comment",url:o.url}),s?.id===o.user.id?(0,V.jsxs)(h.ActionPanel.Section,{children:[(0,V.jsx)(h.Action.Push,{title:"Edit Comment",icon:h.Icon.Pencil,shortcut:h.Keyboard.Shortcut.Common.Edit,target:(0,V.jsx)(qe,{issue:e,comment:o,mutateComments:a})}),(0,V.jsx)(h.Action,{title:"Delete Comment",icon:h.Icon.Trash,style:h.Action.Style.Destructive,shortcut:h.Keyboard.Shortcut.Common.Remove,onAction:()=>n(o.id)})]}):null,(0,V.jsx)(h.ActionPanel.Section,{children:(0,V.jsx)(h.Action.Push,{title:"Add Comment",icon:h.Icon.Plus,shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},target:(0,V.jsx)(qe,{issue:e,mutateComments:a})})}),(0,V.jsxs)(h.ActionPanel.Section,{children:[(0,V.jsx)(h.Action.CopyToClipboard,{icon:h.Icon.Clipboard,content:o.url,title:"Copy Comment URL",shortcut:h.Keyboard.Shortcut.Common.CopyPath}),(0,V.jsx)(h.Action.CopyToClipboard,{icon:h.Icon.Clipboard,content:o.body,title:"Copy Comment",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,V.jsx)(h.ActionPanel.Section,{children:(0,V.jsx)(h.Action,{title:"Refresh",icon:h.Icon.ArrowClockwise,shortcut:h.Keyboard.Shortcut.Common.Refresh,onAction:a})})]})},o.id)})]})}var Be=require("@raycast/api");var gi=require("@raycast/utils");function ft(){let{linearClient:e}=k(),{data:t,error:s,isLoading:r}=(0,gi.useCachedPromise)(()=>e.issuePriorityValues,[],{initialData:[]});return{priorities:t,prioritiesError:s,isLoadingPriorities:!t&&!s||r}}var pe=require("@raycast/api"),xt=require("date-fns");var Qe=require("react/jsx-runtime");function It({issue:e,mutateList:t,mutateSubIssues:s,priorities:r,me:i}){let c=[e.identifier,e.state.name,e.priorityLabel];e.assignee&&c.push(e.assignee.email,e.assignee.displayName);let a=new Date(e.updatedAt),n=e.dueDate?new Date(e.dueDate):null,o=e.estimate?{icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},text:Ct({estimate:e.estimate,issueEstimationType:e.team.issueEstimationType})}:null,d=e.cycle?ve(e.cycle):null,m=e.project||null,b=e.labels.nodes.length>0,L=[{date:a,tooltip:`Updated: ${(0,xt.format)(a,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:n?Dt(n):void 0,text:n?(0,xt.format)(n,"MMM dd"):void 0,tooltip:n?`Due date: ${(0,xt.format)(n,"MM/dd/yyyy")}`:void 0},{icon:b?pe.Icon.Tag:void 0,text:b?String(e.labels.nodes.length):void 0,tooltip:b?e.labels.nodes.map(T=>T.name).join(", "):void 0},{icon:m?le(m):void 0,tooltip:`Project: ${m?m.name:void 0}`},{icon:d?{source:d.icon}:void 0,text:d?String(d.number):void 0,tooltip:d?`Cycle: ${d.title}`:void 0},{icon:o?o.icon:void 0,text:o?o.text:void 0},{icon:G(e.state),tooltip:`Status: ${e.state.name}`},{icon:H(e.assignee),tooltip:e.assignee?`Assignee: ${e.assignee?.displayName} (${e.assignee?.email})`:"Unassigned"}];return(0,Qe.jsx)(pe.List.Item,{title:e.title,icon:{value:{source:ae[e.priority]},tooltip:`Priority: ${e.priorityLabel}`},subtitle:e.identifier,keywords:c,accessories:L,actions:(0,Qe.jsxs)(pe.ActionPanel,{title:e.identifier,children:[(0,Qe.jsx)(pe.Action.Push,{title:"Show Details",icon:pe.Icon.Sidebar,target:(0,Qe.jsx)(yt,{issue:e,mutateList:t,priorities:r,me:i})}),(0,Qe.jsx)(et,{issue:e,mutateList:t,mutateSubIssues:s,priorities:r,me:i})]})},e.id)}var we=require("react/jsx-runtime");function ts({issue:e,mutateList:t}){let{issues:s,isLoadingIssues:r,mutateList:i}=J(d=>Ps(d),[e.id]),{priorities:c,isLoadingPriorities:a}=ft(),{me:n,isLoadingMe:o}=We();return(0,we.jsxs)(Be.List,{isLoading:r||o||a||o,navigationTitle:`${e.identifier} \u2022 Sub-issues`,children:[(0,we.jsx)(Be.List.EmptyView,{title:"No issues",description:"This issue doesn't have any sub-issues.",actions:(0,we.jsx)(Be.ActionPanel,{children:(0,we.jsx)(Be.Action.Push,{title:"Create Sub-Issue",target:(0,we.jsx)(ht,{priorities:c,me:n,parentId:e.id,projectId:e.project?.id,cycleId:e.cycle?.id,teamId:e.team.id})})})}),s?.map(d=>(0,we.jsx)(It,{issue:d,mutateList:t,mutateSubIssues:i,priorities:c,me:n},d.id))]})}var j=require("@raycast/api");function Ii(e){let t=[`Work on Linear issue ${e.identifier}:`,""],s=ir(e.branchName);if(s&&t.push(`Suggested branch name: ${s}`,""),t.push(`<issue identifier="${vt(e.identifier)}">`),t.push(`<title>${e.title}</title>`),t.push(...yi(e.description)),e.team?.name&&t.push(`<team name="${vt(e.team.name)}"/>`),e.labels?.nodes?.forEach(i=>{t.push(`<label>${i.name}</label>`)}),e.project?.name){let i=vt(e.project.name);t.push(e.project.description?`<project name="${i}">${e.project.description}</project>`:`<project name="${i}"/>`)}e.parent&&t.push(...fi("parent-issue",e.parent));let r=e.children?.nodes??[];return r.length>0&&(t.push("<sub-issues>"),r.forEach(i=>t.push(...fi("sub-issue",i))),t.push("</sub-issues>")),t.push("</issue>"),t.join(`
`)}function fi(e,t){return[`<${e} identifier="${vt(t.identifier)}">`,`<id>${t.id}</id>`,`<title>${t.title}</title>`,...yi(t.description),`</${e}>`]}function yi(e){return e?e.includes(`
`)?["<description>",e,"</description>"]:[`<description>${e}</description>`]:[]}function ir(e){return e&&e.slice(e.lastIndexOf("/")+1)}function vt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var te=require("react/jsx-runtime"),rr={ISSUE_TITLE:"title",ISSUE_ID:"identifier",ISSUE_URL:"url",ISSUE_BRANCH_NAME:"branchName"};function or(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function nr(e){return e.replace(/\[/g,"\\[").replace(/\]/g,"\\]")}function ar(e){return{html:`<a href="${e.url}">${or(e.title)}</a>`,text:`[${nr(e.title)}](${e.url})`}}function ss({issue:e}){let{issueCustomCopyAction:t}=(0,j.getPreferenceValues)();async function s(){let r=await(0,j.showToast)({style:j.Toast.Style.Animated,title:"Copying prompt"});try{await j.Clipboard.copy(Ii(await Ss(e.id))),r.style=j.Toast.Style.Success,r.title="Copied prompt to clipboard"}catch(i){r.style=j.Toast.Style.Failure,r.title="Failed copying prompt",r.message=q(i)}}return(0,te.jsxs)(j.ActionPanel.Section,{children:[(0,te.jsx)(j.Action.CopyToClipboard,{content:e.identifier,title:"Copy Issue ID",shortcut:{macOS:{modifiers:["cmd"],key:"."},Windows:{modifiers:["ctrl"],key:"."}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:{html:`<a href="${e.url}" title="${e.title}">${e.identifier}: ${e.title}</a>`,text:e.url},title:"Copy Formatted Issue URL",shortcut:j.Keyboard.Shortcut.Common.CopyPath}),(0,te.jsx)(j.Action.CopyToClipboard,{content:e.url,title:"Copy Issue URL",shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:e.title,title:"Copy Issue Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:ar(e),title:"Copy Title as Link",shortcut:{macOS:{modifiers:["cmd","shift"],key:"t"},Windows:{modifiers:["ctrl","shift"],key:"t"}}}),(0,te.jsx)(j.Action.CopyToClipboard,{content:e.branchName,title:"Copy Git Branch Name",shortcut:j.Keyboard.Shortcut.Common.CopyName}),t&&t!==""?(0,te.jsx)(j.Action.CopyToClipboard,{content:t?.replace(/\{(.*?)\}/g,(r,i)=>{let c=e[rr[i]];return c||r}),title:"Custom Copy",shortcut:{macOS:{modifiers:["cmd","opt"],key:"."},Windows:{modifiers:["ctrl","alt"],key:"."}}}):null,(0,te.jsx)(j.Action,{icon:j.Icon.Clipboard,title:"Copy as Prompt",onAction:s,shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"p"},Windows:{modifiers:["ctrl","alt","shift"],key:"p"}}})]})}var se=require("@raycast/api"),hi=require("react");var ie=require("react/jsx-runtime");function is({issue:e,updateIssue:t}){let{linearClient:s}=k(),[r,i]=(0,hi.useState)(!1),{cycles:c,isLoadingCycles:a}=je(e.team.id,{execute:r}),n=e.cycle?ve(e.cycle):null,o=n?.isActive||!1,d=n?.isNext||!1;async function m(T){let $=e.cycle;t({animatedTitle:"Moving to cycle",payload:{cycleId:T?.id||null},optimisticUpdate(w){return{...w,cycle:T||void 0}},rollbackUpdate(w){return{...w,cycle:$}},successTitle:T?"Moved to cycle":"Removed from cycle",successMessage:T?.title?T.title:"",errorTitle:"Failed to move to cycle"})}async function b(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),$=he(T||[]),w=$.findIndex(D=>D.isActive),U=(w>-1?$[w]:null)?$[w+1]:null;if(U)return m(U)}async function L(){let{nodes:T}=await s.cycles({filter:{team:{id:{eq:e.team.id}}}}),w=he(T||[]).find(K=>K.isActive);if(w)return m(w)}return(0,ie.jsxs)(ie.Fragment,{children:[(0,ie.jsxs)(se.ActionPanel.Submenu,{title:"Move to Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:se.Keyboard.Shortcut.Common.Copy,onOpen:()=>i(!0),children:[(0,ie.jsx)(se.Action,{title:"No Cycle",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}},onAction:()=>m(null)}),!c&&a?(0,ie.jsx)(se.Action,{title:"Loading\u2026"}):he(c||[]).map(T=>(0,ie.jsx)(se.Action,{autoFocus:T.id===n?.id,title:T.title,icon:{source:T.icon},onAction:()=>m(T)},T.id))]}),o?null:(0,ie.jsx)(se.Action,{title:"Move to Active Cycle",icon:{source:{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}},shortcut:se.Keyboard.Shortcut.Common.Copy,onAction:()=>L()}),d?null:(0,ie.jsx)(se.Action,{title:"Move to Next Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},onAction:()=>b()})]})}var re=require("@raycast/api"),ki=require("lodash"),Pi=require("react");var ge=require("react/jsx-runtime");function rs({issue:e,updateIssue:t}){let[s,r]=(0,Pi.useState)(!1),{labels:i}=Me(e.team.id,{execute:s}),[,c]=(0,ki.partition)(i||[],o=>e.labels.nodes.map(d=>d.id).includes(o.id));async function a(o){let d=e.labels.nodes.map(m=>m.id);t({animatedTitle:"Adding label",payload:{labelIds:[...d,o.id]},optimisticUpdate(m){return{...m,labels:{...m.labels,nodes:[...m.labels.nodes,o]}}},rollbackUpdate(m){return{...m,labels:{...m.labels,nodes:m.labels.nodes.filter(b=>b.id!==o.id)}}},successTitle:"Added label",successMessage:`Label "${o.name}" added to ${e.identifier}`,errorTitle:"Failed to add label"})}async function n(o){let d=e.labels.nodes.map(m=>m.id);t({animatedTitle:"Remove label",payload:{labelIds:d.filter(m=>m!==o.id)},optimisticUpdate(m){return{...m,labels:{...m.labels,nodes:m.labels.nodes.filter(b=>b.id!==o.id)}}},rollbackUpdate(m){return{...m,labels:{...m.labels,nodes:[...m.labels.nodes,o]}}},successTitle:"Removed label",successMessage:`Label "${o.name}" removed from ${e.identifier}`,errorTitle:"Failed to remove label"})}return(0,ge.jsxs)(ge.Fragment,{children:[(0,ge.jsx)(re.ActionPanel.Submenu,{title:"Add Label",icon:re.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},onOpen:()=>r(!0),children:c.map(o=>(0,ge.jsx)(re.Action,{title:o.name,icon:{source:re.Icon.Dot,tintColor:o.color},onAction:()=>a(o)},o.id))}),e.labels.nodes.length>0?(0,ge.jsx)(re.ActionPanel.Submenu,{title:"Remove Label",icon:re.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},children:e.labels.nodes.map(o=>(0,ge.jsx)(re.Action,{title:o.name,icon:{source:re.Icon.Dot,tintColor:o.color},onAction:()=>n(o)},o.id))}):null]})}var Ae=require("@raycast/api"),Si=require("react");var tt=require("react/jsx-runtime");function os({issue:e,updateIssue:t}){let[s,r]=(0,Si.useState)(!1),{milestones:i,isLoadingMilestones:c}=Ue(e.project?.id,{execute:s});async function a(n){let o=e.projectMilestone;t({animatedTitle:"Setting milestone",payload:{projectMilestoneId:n?n.id:null},optimisticUpdate(d){return{...d,milestone:n||void 0}},rollbackUpdate(d){return{...d,milestone:o}},successTitle:n?"Set milestone":`Removed milestone from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set milestone"})}return(0,tt.jsxs)(Ae.ActionPanel.Submenu,{title:"Set Milestone",icon:{source:"linear-icons/milestone.svg",tintColor:Ae.Color.PrimaryText},shortcut:{modifiers:["ctrl","shift"],key:"m"},onOpen:()=>r(!0),children:[(0,tt.jsx)(Ae.Action,{title:"No Milestone",icon:{source:"linear-icons/no-milestone.svg"},onAction:()=>a(null)}),!i&&c?(0,tt.jsx)(Ae.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,tt.jsx)(Ae.Action,{autoFocus:n.id===e.projectMilestone?.id,title:`${n.name}  (${n.targetDate||"No Target Date"})`,icon:Pe(n),onAction:()=>a(n)},n.id))]})}var st=require("@raycast/api"),bi=require("react");var fe=require("react/jsx-runtime");function ns({issue:e,updateIssue:t}){let[s,r]=(0,bi.useState)(!1),{issues:i,isLoadingIssues:c}=J(Xe,[],{execute:s}),a=e.parent,n=a?.id,o=!!n;async function d(m){t({animatedTitle:"Setting parent issue",payload:{parentId:m?m.id:null},optimisticUpdate(b){return{...b,parent:m||void 0}},rollbackUpdate(b){return{...b,parent:a}},successTitle:"Set parent issue",successMessage:m?`${m.identifier} set as parent issue`:`Removed parent issue from ${e.identifier}`,errorTitle:"Failed to set parent issue"})}return(0,fe.jsxs)(fe.Fragment,{children:[(0,fe.jsx)(st.ActionPanel.Submenu,{title:o?"Change Parent Issue":"Set Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"i"},onOpen:()=>r(!0),children:!i&&c?(0,fe.jsx)(st.Action,{title:"Loading\u2026"}):(i||[]).map(m=>(0,fe.jsx)(st.Action,{autoFocus:m.id===n,title:`${m.identifier} - ${m.title}`,icon:G(m.state),onAction:()=>d(m)},m.id))}),o?(0,fe.jsx)(st.Action,{title:"Remove Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"k"},Windows:{modifiers:["ctrl","shift"],key:"k"}},onAction:()=>d(null)}):null]})}var it=require("@raycast/api"),Ci=require("react");var rt=require("react/jsx-runtime");function as({issue:e,updateIssue:t}){let[s,r]=(0,Ci.useState)(!1),{projects:i,isLoadingProjects:c}=Fe(e.team.id,{execute:s});async function a(n){let o=e.project;t({animatedTitle:"Setting project",payload:{projectId:n?n.id:null},optimisticUpdate(d){return{...d,project:n||void 0}},rollbackUpdate(d){return{...d,project:o}},successTitle:n?"Set project":`Removed project from ${e.identifier}`,successMessage:n?`"${n.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set project"})}return(0,rt.jsxs)(it.ActionPanel.Submenu,{title:"Set Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"p"},onOpen:()=>r(!0),children:[(0,rt.jsx)(it.Action,{title:"No Project",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}},onAction:()=>a(null)}),!i&&c?(0,rt.jsx)(it.Action,{title:"Loading\u2026"}):(i||[]).map(n=>(0,rt.jsx)(it.Action,{autoFocus:n.id===e.project?.id,title:`${n.name} (${n.status.name})`,icon:le(n),onAction:()=>a(n)},n.id))]})}var ze=require("@raycast/api"),wi=require("react");var jt=require("react/jsx-runtime");function ls({issue:e,updateIssue:t}){let[s,r]=(0,wi.useState)(!1),{states:i,isLoadingStates:c}=me(e.team.id,{execute:s}),a=Se(i||[]);async function n(o){let d=e.state;t({animatedTitle:"Setting status",payload:{stateId:o.id},optimisticUpdate(m){return{...m,state:o}},rollbackUpdate(m){return{...m,state:d}},successTitle:"Set status",successMessage:`${e.identifier} set to ${o.name}`,errorTitle:"Failed to set status"})}return(0,jt.jsx)(ze.ActionPanel.Submenu,{icon:ze.Icon.Circle,title:"Set Status",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},onOpen:()=>r(!0),children:a.length===0&&c?(0,jt.jsx)(ze.Action,{title:"Loading\u2026"}):a.map(o=>(0,jt.jsx)(ze.Action,{autoFocus:o.id===e.state.id,title:o.name,icon:G(o),onAction:()=>n(o)},o.id))})}var P=require("react/jsx-runtime");function et({issue:e,mutateList:t,mutateSubIssues:s,mutateDetail:r,showAttachmentsAction:i,attachments:c,priorities:a,me:n}){let{pop:o}=(0,g.useNavigation)(),{linearClient:d}=k(),m=e.assignee?.id===n?.id,b=Je({issueEstimationType:e.team.issueEstimationType,issueEstimationAllowZero:e.team.issueEstimationAllowZero,issueEstimationExtended:e.team.issueEstimationExtended});async function L({animatedTitle:I,payload:A,optimisticUpdate:R,rollbackUpdate:B,successTitle:$e,successMessage:De,errorTitle:Ze}){try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:I});let X=d.updateIssue(e.id,A);await Promise.all([X,t?t(X,{optimisticUpdate(E){if(E)return E.map(N=>N.id===e.id?R(N):N)},rollbackOnError(E){if(E)return E.map(N=>N.id===e.id?B(N):N)}}):Promise.resolve(),s?s(X,{optimisticUpdate(E){if(E)return E.map(N=>N.id===e.id?R(N):N)},rollbackOnError(E){if(E)return E.map(N=>N.id===e.id?B(N):N)}}):Promise.resolve(),r?r(X,{optimisticUpdate(E){return R(E)},rollbackOnError(E){return B(E)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:$e,message:De})}catch(X){await(0,g.showToast)({style:g.Toast.Style.Failure,title:Ze,message:q(X)})}}async function T(){if(await(0,g.confirmAlert)({title:"Delete Issue",message:"Are you sure you want to delete the selected issue?",icon:{source:g.Icon.Trash,tintColor:g.Color.Red}}))try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Deleting issue"});let I=d.deleteIssue(e.id);r&&o(),await Promise.all([I,t?t(I,{optimisticUpdate(A){if(A)return A.filter(R=>R.id!==e.id)}}):Promise.resolve(),s?s(I,{optimisticUpdate(A){if(A)return A.filter(R=>R.id!==e.id)}}):Promise.resolve()]),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Issue deleted",message:`"${e.title}" is deleted`})}catch(I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to delete issue",message:q(I)})}}async function $(I){let A=e.priority;L({animatedTitle:"Setting priority",payload:{priority:I.priority},optimisticUpdate(R){return{...R,priority:I.priority}},rollbackUpdate(R){return{...R,priority:A}},successTitle:"Set priority",successMessage:`${e.identifier} priority set to ${I.label}`,errorTitle:"Failed to set priority"})}async function w(I){let A=e.assignee;L({animatedTitle:"Setting assignee",payload:{assigneeId:I.id},optimisticUpdate(R){return{...R,assignee:I}},rollbackUpdate(R){return{...R,assignee:A}},successTitle:"Set assignee",successMessage:`${e.identifier} assigned to ${I.displayName}`,errorTitle:"Failed to set assignee"})}async function K(I){let A=e.assignee;L({animatedTitle:"Setting assignee",payload:{assigneeId:I?I.id:null},optimisticUpdate(R){return{...R,assignee:I||void 0}},rollbackUpdate(R){return{...R,assignee:A}},successTitle:"Set assignee",successMessage:`${e.identifier} ${I?"assigned to":"un-assigned from"} me`,errorTitle:"Failed to set assignee"})}async function U({estimate:I,label:A}){let R=e.estimate;L({animatedTitle:"Setting estimate",payload:{estimate:I},optimisticUpdate(B){return{...B,estimate:I}},rollbackUpdate(B){return{...B,estimate:R}},successTitle:"Set estimate",successMessage:`${e.identifier} estimate set to ${A}`,errorTitle:"Failed to set estimate"})}async function D(I){L({animatedTitle:I?"Setting due date":"Removing due date",payload:{dueDate:I},optimisticUpdate(A){return{...A,dueDate:I}},rollbackUpdate(A){return{...A,dueDate:A.dueDate}},successTitle:I?"Set due date":"Removed due date",successMessage:I?`${e.identifier} due date set to ${(0,cs.format)(I,"MM/dd/yyyy")}`:"",errorTitle:"Failed to set due date"})}async function v(I){if(!I){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed setting reminder"});return}try{await(0,g.showToast)({style:g.Toast.Style.Animated,title:"Setting reminder"}),await d.issueReminder(e.id,I),r&&o(),await(0,g.showToast)({style:g.Toast.Style.Success,title:"Reminder set",message:`${e.identifier} reminder set to ${(0,cs.format)(I,"MM/dd/yyyy")}`})}catch(A){await(0,g.showToast)({style:g.Toast.Style.Failure,title:"Failed to set reminder",message:q(A)})}}function W(){t&&t(),s&&s(),r&&r()}let[de,Te]=(0,Ai.useState)(""),{users:_,supportsUserTypeahead:oe,isLoadingUsers:Ie}=Ee(de);return(0,P.jsxs)(P.Fragment,{children:[(0,P.jsx)(gt,{title:"Open Issue",url:e.url}),(0,P.jsxs)(g.ActionPanel.Section,{children:[(0,P.jsx)(g.Action.Push,{title:"Edit Issue",icon:g.Icon.Pencil,shortcut:g.Keyboard.Shortcut.Common.Edit,target:(0,P.jsx)(Zt,{priorities:a,me:n,issue:e,mutateList:t,mutateSubIssues:s})}),(0,P.jsx)(ls,{issue:e,updateIssue:L}),a&&a.length>0?(0,P.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.LevelMeter,title:"Set Priority",shortcut:{macOS:{modifiers:["cmd","opt"],key:"p"},Windows:{modifiers:["ctrl","alt"],key:"p"}},children:a.map(I=>(0,P.jsx)(g.Action,{autoFocus:I.priority===e.priority,title:I.label,icon:{source:ae[I.priority]},onAction:()=>$(I)},I.priority))}):null,(0,P.jsx)(g.ActionPanel.Submenu,{icon:g.Icon.AddPerson,title:"Assign to",shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}},...oe&&{onSearchTextChange:Te,isLoading:Ie,throttle:!0},children:_?.map(I=>(0,P.jsx)(g.Action,{autoFocus:I.id===e.assignee?.id,title:`${I.displayName} (${I.email})`,icon:H(I),onAction:()=>w(I)},I.id))}),n?(0,P.jsx)(g.Action,{title:m?"Un-Assign from Me":"Assign to Me",icon:H(n),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}},onAction:()=>K(m?null:n)}):null,b?(0,P.jsx)(g.ActionPanel.Submenu,{title:"Set Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}},children:b.map(({estimate:I,label:A})=>(0,P.jsx)(g.Action,{autoFocus:I===e.estimate,title:A,onAction:()=>U({estimate:I,label:A})},I))}):null,(0,P.jsx)(g.Action.PickDate,{title:"Set Due Date",shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}},onChange:D}),(0,P.jsx)(g.Action.PickDate,{title:"Set Reminder",shortcut:{macOS:{modifiers:["cmd","shift"],key:"h"},Windows:{modifiers:["ctrl","shift"],key:"h"}},onChange:v}),(0,P.jsx)(rs,{issue:e,updateIssue:L}),(0,P.jsx)(is,{issue:e,updateIssue:L}),(0,P.jsx)(as,{issue:e,updateIssue:L}),(0,P.jsx)(os,{issue:e,updateIssue:L}),(0,P.jsx)(ns,{issue:e,updateIssue:L}),(0,P.jsx)(g.Action,{title:"Delete Issue",shortcut:g.Keyboard.Shortcut.Common.Remove,icon:g.Icon.Trash,style:g.Action.Style.Destructive,onAction:()=>T()})]}),(0,P.jsxs)(g.ActionPanel.Section,{children:[(0,P.jsx)(g.Action.Push,{title:"Show Sub-Issues",icon:g.Icon.List,target:(0,P.jsx)(ts,{issue:e,mutateList:t}),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}),(0,P.jsx)(g.Action.Push,{title:"Break Issues into Sub-Issues",icon:g.Icon.Stars,target:(0,P.jsx)(_t,{issue:e}),shortcut:{macOS:{modifiers:["opt","shift"],key:"m"},Windows:{modifiers:["alt","shift"],key:"m"}}}),i?(0,P.jsx)(g.Action.Push,{title:"Show Issue Links",icon:g.Icon.Link,target:(0,P.jsx)(Ht,{attachments:c??[],issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}}):null,(0,P.jsx)(g.Action.Push,{title:"Add Attachments and Links",icon:g.Icon.NewDocument,target:(0,P.jsx)(Rt,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,P.jsx)(g.Action.Push,{title:"Add Comment",icon:g.Icon.Plus,target:(0,P.jsx)(qe,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"n"},Windows:{modifiers:["ctrl","alt","shift"],key:"n"}}}),(0,P.jsx)(g.Action.Push,{title:"Show Comments",icon:g.Icon.Bubble,target:(0,P.jsx)(es,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"c"},Windows:{modifiers:["ctrl","alt","shift"],key:"c"}}})]}),(0,P.jsx)(ss,{issue:e}),(0,P.jsx)(g.ActionPanel.Section,{children:(0,P.jsx)(g.Action,{title:"Refresh",icon:g.Icon.ArrowClockwise,shortcut:g.Keyboard.Shortcut.Common.Refresh,onAction:()=>W()})})]})}var F=require("react/jsx-runtime");function yt({issue:e,mutateList:t,priorities:s,me:r}){let{issue:i,isLoadingIssue:c,mutateDetail:a}=Ne(e),n=`# ${i?.title}`;i?.description&&(n+=`

${i.description}`);let o=i?.cycle?ve(i.cycle):null,d=i.relations?i.relations.nodes.filter(L=>L.type=="related"):null,m=i.relations?i.relations.nodes.filter(L=>L.type=="duplicate"):null,b=i.attachments?.nodes.length??0;return(0,F.jsx)(M.Detail,{markdown:n,isLoading:c,...i?{metadata:(0,F.jsxs)(M.Detail.Metadata,{children:[(0,F.jsx)(M.Detail.Metadata.Label,{title:"Status",text:i.state.name,icon:G(i.state)}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Priority",text:i.priorityLabel,icon:{source:ae[i.priority]}}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Assignee",text:i.assignee?i.assignee.displayName:"Unassigned",icon:H(i.assignee)}),i.team.issueEstimationType!=="notUsed"?(0,F.jsx)(M.Detail.Metadata.Label,{title:"Estimate",text:Ct({estimate:i.estimate,issueEstimationType:i.team.issueEstimationType}),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}):null,i.labels.nodes.length>0?(0,F.jsx)(M.Detail.Metadata.TagList,{title:"Labels",children:i.labels.nodes.map(({id:L,name:T,color:$})=>(0,F.jsx)(M.Detail.Metadata.TagList.Item,{text:T,color:$},L))}):(0,F.jsx)(M.Detail.Metadata.Label,{title:"Labels",text:"No Labels"}),i.dueDate?(0,F.jsx)(M.Detail.Metadata.Label,{title:"Due Date",text:(0,Li.format)(new Date(i.dueDate),"MM/dd/yyyy"),icon:Dt(new Date(i.dueDate))}):null,b>0?(0,F.jsx)(M.Detail.Metadata.Label,{title:"Links",text:`${b>1?`${b} links`:"1 link"}`,icon:M.Icon.Link}):null,(0,F.jsx)(M.Detail.Metadata.Separator,{}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Cycle",text:o?o.title:"No Cycle",icon:{source:o?o.icon:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Project",text:i.project?i.project.name:"No Project",icon:le(i.project)}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Milestone",text:i.projectMilestone?i.projectMilestone.name:"No Milestone",icon:Pe(i.projectMilestone)}),(0,F.jsx)(M.Detail.Metadata.Label,{title:"Parent Issue",text:i.parent?i.parent.title:"No Issue",icon:i.parent?G(i.parent.state):{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),d&&d.length>0?(0,F.jsx)(M.Detail.Metadata.TagList,{title:"Related",children:d.map(({id:L,relatedIssue:T})=>(0,F.jsx)(M.Detail.Metadata.TagList.Item,{text:T.identifier},L))}):null,m&&m.length>0?(0,F.jsx)(M.Detail.Metadata.TagList,{title:"Duplicates",children:m.map(({id:L,relatedIssue:T})=>(0,F.jsx)(M.Detail.Metadata.TagList.Item,{text:T.identifier},L))}):null]}),actions:(0,F.jsx)(M.ActionPanel,{children:(0,F.jsx)(et,{issue:i,mutateList:t,mutateDetail:a,priorities:s,showAttachmentsAction:b>0,attachments:i.attachments?.nodes??[],me:r})})}:{}})}var f=require("react/jsx-runtime");function lr(e,t){return e==="url"?{title:"Copy Issue URL",onAction:()=>l.Clipboard.copy(t.url)}:e==="id-as-link"?{title:"Copy Issue ID as Link",onAction:()=>l.Clipboard.copy({text:`[${t.identifier}](${t.url})`,html:`<a href="${t.url}">${t.identifier}</a>`})}:e==="title"?{title:"Copy Issue Title",onAction:()=>l.Clipboard.copy(t.title)}:e==="title-as-link"?{title:"Copy Issue Title as Link",onAction:()=>l.Clipboard.copy({text:`[${t.title}](${t.url})`,html:`<a href="${t.url}">${t.title}</a>`})}:{title:"Copy Issue ID",onAction:()=>l.Clipboard.copy(t.identifier)}}function ht(e){let{push:t}=(0,l.useNavigation)(),{autofocusField:s,copyToastAction:r}=(0,l.getPreferenceValues)(),[i,c]=(0,Le.useState)(""),{teams:a,org:n,supportsTeamTypeahead:o,isLoadingTeams:d}=ut(i),m=a&&a.length>1,[b,L]=(0,Le.useState)(""),{users:T,supportsUserTypeahead:$,isLoadingUsers:w}=Ee(b),{handleSubmit:K,itemProps:U,values:D,setValue:v,focus:W,reset:de,setValidationError:Te}=(0,Ge.useForm)({async onSubmit(u){let x=await(0,l.showToast)({style:l.Toast.Style.Animated,title:"Creating issue"}),ye=m?u.teamId:a?.[0]?.id;if(!ye)return Te("teamId","The team is required."),!1;try{let z={teamId:ye,title:u.title,description:u.description||"",stateId:u.stateId,labelIds:u.labelIds,dueDate:u.dueDate,...N&&u.estimate?{estimate:parseInt(u.estimate)}:{},...u.assigneeId?{assigneeId:u.assigneeId}:{},...u.cycleId?{cycleId:u.cycleId}:{},...u.projectId?{projectId:u.projectId}:{},...u.milestoneId?{projectMilestoneId:u.milestoneId}:{},...u.parentId?{parentId:u.parentId}:{},priority:parseInt(u.priority)},{success:Nt,issue:He}=await As(z);if(Nt&&He){x.style=l.Toast.Style.Success,x.title=`Created Issue \u2022 ${He?.identifier}`,x.primaryAction={title:"Open Issue",shortcut:l.Keyboard.Shortcut.Common.OpenWith,onAction:async()=>{t((0,f.jsx)(yt,{issue:He,priorities:e.priorities,me:e.me})),await x.hide()}},x.secondaryAction={shortcut:l.Keyboard.Shortcut.Common.Copy,...lr(r,He)},de({templateId:"",title:"",description:"",estimate:"",labelIds:[],dueDate:null,parentId:"",attachments:[],links:""}),W(m&&s?s:"title");let Ot=wt(u.links);if(Ot.length>0){let Re=Ot.length===1?"link":"links";try{x.message=`Attaching ${Re}\u2026`,await Promise.all(Ot.map(xe=>bt({issueId:He.id,url:xe}))),x.message=`Successfully attached ${Re}`}catch(xe){x.style=l.Toast.Style.Failure,x.title=`Failed attaching ${Re}`,x.message=q(xe)}}if(u.attachments.length>0){let Re=u.attachments.length===1?"attachment":"attachments";try{x.message=`Uploading ${Re}\u2026`,await Promise.all(u.attachments.map(xe=>St({issueId:He.id,url:xe}))),x.message=`Successfully uploaded ${Re}`}catch(xe){x.style=l.Toast.Style.Failure,x.title=`Failed uploading ${Re}`,x.message=q(xe)}}}}catch(z){x.style=l.Toast.Style.Failure,x.title="Failed to create issue",x.message=q(z)}v("teamId",ye)},validation:{teamId:m?Ge.FormValidation.Required:void 0,title:Ge.FormValidation.Required,stateId:Ge.FormValidation.Required,priority:Ge.FormValidation.Required},initialValues:{templateId:e.draftValues?.templateId||"",teamId:e.draftValues?.teamId||e.teamId,title:e.draftValues?.title,description:e.draftValues?.description,priority:e.draftValues?.priority,stateId:e.draftValues?.stateId,estimate:e.draftValues?.estimate,assigneeId:e.draftValues?.assigneeId||e.assigneeId,labelIds:e.draftValues?.labelIds||[],dueDate:e.draftValues?.dueDate,cycleId:e.draftValues?.cycleId||e.cycleId,projectId:e.draftValues?.projectId||e.projectId,milestoneId:e.draftValues?.milestoneId||e.milestoneId,parentId:e.draftValues?.parentId||e.parentId,links:e.draftValues?.links||""}}),_=!!D.teamId&&D.teamId.trim().length>0,{issueTemplates:oe,isLoadingIssueTemplates:Ie}=Gt(D.teamId,{execute:_}),{states:I}=me(D.teamId,{execute:_}),{labels:A}=Me(D.teamId,{execute:_}),{cycles:R}=je(D.teamId,{execute:_}),{issues:B}=J(Xe,[],{execute:_}),{projects:$e}=Fe(D.teamId,{execute:_}),{milestones:De}=Ue(D.projectId,{execute:!!D.projectId});(0,Le.useEffect)(()=>{a?.length===1&&v("teamId",a[0].id)},[a]);let Ze=(0,Le.useRef)(!1);(0,Le.useEffect)(()=>{if(!Ze.current){Ze.current=!0;return}X("")},[D.teamId]);function X(u){v("templateId",u);let x=oe?.find(Nt=>Nt.id===u),ye={assigneeId:e.assigneeId||"",cycleId:e.cycleId||"",projectId:e.projectId||"",milestoneId:e.milestoneId||""},z=x?xs(x,ye):Bt(ye);v("title",z.title),v("description",z.description),v("stateId",z.stateId),v("priority",z.priority),v("assigneeId",z.assigneeId),v("labelIds",z.labelIds),v("estimate",z.estimate),v("dueDate",z.dueDate),v("cycleId",z.cycleId),v("projectId",z.projectId),v("milestoneId",z.milestoneId??"")}let E=a?.find(u=>u.id===D.teamId),N=E?Je({issueEstimationType:E.issueEstimationType,issueEstimationAllowZero:E.issueEstimationAllowZero,issueEstimationExtended:E.issueEstimationExtended}):null,Ft=Se(I||[]),kt=I&&I.length>0,p=e.priorities&&e.priorities.length>0,Z=A&&A.length>0,ue=R&&R.length>0,lt=$e&&$e.length>0,ps=De&&De.length>0,Et=B&&B.length>0,Ri=oe&&oe.length>0;return(0,f.jsxs)(l.Form,{enableDrafts:e.enableDrafts,actions:(0,f.jsxs)(l.ActionPanel,{children:[(0,f.jsx)(l.Action.SubmitForm,{icon:l.Icon.Plus,onSubmit:K,title:"Create Issue"}),(0,f.jsxs)(l.ActionPanel.Section,{children:[(0,f.jsx)(l.Action,{title:"Focus Title",icon:l.Icon.TextInput,onAction:()=>W("title"),shortcut:l.Keyboard.Shortcut.Common.Edit}),(0,f.jsx)(l.Action,{title:"Focus Description",icon:l.Icon.TextInput,onAction:()=>W("description"),shortcut:{modifiers:["ctrl"],key:"e"}}),(0,f.jsx)(l.Action,{title:"Focus Status",icon:l.Icon.Circle,onAction:()=>W("stateId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}}}),(0,f.jsx)(l.Action,{title:"Focus Priority",icon:l.Icon.LevelMeter,onAction:()=>W("priority"),shortcut:l.Keyboard.Shortcut.Common.Pin}),(0,f.jsx)(l.Action,{title:"Focus Assignee",icon:l.Icon.AddPerson,onAction:()=>W("assigneeId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}}}),N?(0,f.jsx)(l.Action,{title:"Focus Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},onAction:()=>W("estimate"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}}}):null,(0,f.jsx)(l.Action,{title:"Focus Due Date",icon:l.Icon.Calendar,onAction:()=>W("dueDate"),shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}}}),(0,f.jsx)(l.Action,{title:"Focus Labels",icon:l.Icon.Tag,onAction:()=>W("labelIds"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}}}),ue?(0,f.jsx)(l.Action,{title:"Focus Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},onAction:()=>W("cycleId"),shortcut:l.Keyboard.Shortcut.Common.Copy}):null,lt?(0,f.jsx)(l.Action,{title:"Focus Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},onAction:()=>W("projectId"),shortcut:{modifiers:["ctrl","shift"],key:"p"}}):null,ps?(0,f.jsx)(l.Action,{title:"Focus Milestone",icon:{source:{light:"light/milestone.svg",dark:"dark/milestone.svg"}},onAction:()=>W("milestoneId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}):null,Et?(0,f.jsx)(l.Action,{title:"Focus Parent Issue",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}},onAction:()=>W("parentId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}}}):null,(0,f.jsx)(l.Action,{title:"Focus Attachments",icon:l.Icon.NewDocument,onAction:()=>W("attachments"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,f.jsx)(l.Action,{title:"Focus Links",icon:l.Icon.Link,onAction:()=>W("links"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}})]})]}),isLoading:d||w||e.isLoading,children:[(o||m)&&(0,f.jsxs)(f.Fragment,{children:[(0,f.jsx)(l.Form.Dropdown,{title:"Team",storeValue:!0,...U.teamId,...o&&{onSearchTextChange:c,isLoading:d,throttle:!0},children:a?.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:u.name,value:u.id,icon:Lt(u,n)},u.id))}),(0,f.jsx)(l.Form.Separator,{})]}),_&&(Ie||Ri)?(0,f.jsxs)(f.Fragment,{children:[(0,f.jsxs)(l.Form.Dropdown,{id:"templateId",title:"Template",value:D.templateId||"",onChange:X,isLoading:Ie,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Template",value:"",icon:l.Icon.Document}),oe?.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:u.name,value:u.id,icon:l.Icon.Document},u.id))]}),(0,f.jsx)(l.Form.Separator,{})]}):null,(0,f.jsx)(l.Form.TextField,{title:"Title",placeholder:"Issue title",...s==="title"?{autoFocus:!0}:{},...U.title}),(0,f.jsx)(l.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",enableMarkdown:!0,...U.description}),(0,f.jsx)(l.Form.Dropdown,{title:"Status",storeValue:!0,...U.stateId,children:kt?Ft.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:u.name,value:u.id,icon:G(u)},u.id)):null}),(0,f.jsx)(l.Form.Dropdown,{title:"Priority",storeValue:!0,...U.priority,children:p?e.priorities?.map(({priority:u,label:x})=>(0,f.jsx)(l.Form.Dropdown.Item,{title:x,value:String(u),icon:{source:ae[u]}},u)):null}),(0,f.jsxs)(l.Form.Dropdown,{title:"Assignee",storeValue:!0,...U.assigneeId,...$&&{onSearchTextChange:L,isLoading:w,throttle:!0},children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:l.Icon.Person}),T?.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:u.name,value:u.id,icon:H(u)},u.id))]}),(0,f.jsx)(l.Form.TagPicker,{title:"Labels",placeholder:"Add label",...U.labelIds,children:Z?A.map(({id:u,name:x,color:ye})=>(0,f.jsx)(l.Form.TagPicker.Item,{title:x,value:u,icon:{source:l.Icon.Dot,tintColor:ye}},u)):null}),N?(0,f.jsxs)(l.Form.Dropdown,{title:"Estimate",...U.estimate,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),N.map(({estimate:u,label:x})=>(0,f.jsx)(l.Form.Dropdown.Item,{title:x,value:String(u),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},u))]}):null,(0,f.jsx)(l.Form.DatePicker,{title:"Due Date",type:l.Form.DatePicker.Type.Date,...U.dueDate}),ue||lt||Et?(0,f.jsx)(l.Form.Separator,{}):null,ue?(0,f.jsxs)(l.Form.Dropdown,{title:"Cycle",storeValue:!0,...U.cycleId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),he(R).map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:u.title,value:u.id,icon:{source:u.icon}},u.id))]}):null,lt?(0,f.jsxs)(l.Form.Dropdown,{title:"Project",storeValue:!0,...U.projectId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),$e.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${u.name} (${u.status.name})`,value:u.id,icon:le(u)},u.id))]}):null,ps?(0,f.jsxs)(l.Form.Dropdown,{title:"Milestone",storeValue:!0,...U.milestoneId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),De.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${u.name} (${u.targetDate||"No Target Date"})`,value:u.id,icon:Pe(u)},u.id))]}):null,Et?(0,f.jsxs)(l.Form.Dropdown,{title:"Parent",...U.parentId,children:[(0,f.jsx)(l.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),B.map(u=>(0,f.jsx)(l.Form.Dropdown.Item,{title:`${u.identifier} - ${u.title}`,value:u.id,icon:G(u.state)},u.id))]}):null,(0,f.jsx)(l.Form.Separator,{}),(0,f.jsx)(l.Form.FilePicker,{title:"Attachment",...U.attachments}),(0,f.jsx)(l.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...U.links})]})}var Ti=require("@raycast/api"),Mt=require("lodash");var ot=require("react/jsx-runtime");function ds({mutateList:e,issues:t,priorities:s,me:r}){if(!t||t&&t.length===0)return null;let i=(0,Mt.uniqBy)(t.map(n=>n.state),n=>n.id),c=Se(i||[],["triage","started","unstarted","backlog","completed","canceled"]),a=(0,Mt.groupBy)(t,n=>n.state.id);return(0,ot.jsx)(ot.Fragment,{children:c.map(n=>{let o=a[n.id]?.length===1?"1 issue":`${a[n.id]?.length} issues`;return(0,ot.jsx)(Ti.List.Section,{title:n.name,subtitle:o,children:a[n.id]?.map(d=>(0,ot.jsx)(It,{issue:d,mutateList:e,priorities:s,me:r},d.id))},n.id)})})}var at=require("@raycast/api"),$i=require("@raycast/utils"),Ut=ct(require("react"));var nt=require("react/jsx-runtime");function cr({children:e}){return(0,Ut.useEffect)(()=>{ui()},[]),e}var us=class extends Ut.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}render(){let{error:t}=this.state;if(!t)return this.props.children;if(!(t.message.includes("invalid_grant")||t.message.includes("Error while fetching tokens")||t.message.includes("Could not initialize OAuth")))throw t;return(0,nt.jsx)(at.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${t.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,nt.jsx)(at.ActionPanel,{children:(0,nt.jsx)(at.Action,{title:"Sign in Again",onAction:async()=>{await Vt.client.removeTokens(),this.setState({error:null})}})})})}},dr=(0,$i.withAccessToken)(Vt)(cr);function ms({children:e}){return(0,nt.jsx)(us,{children:(0,nt.jsx)(dr,{children:e})})}var ce=require("react/jsx-runtime");function ur(){let{issues:e,isLoadingIssues:t,mutateList:s}=J(ks),{priorities:r,isLoadingPriorities:i}=ft(),{me:c,isLoadingMe:a}=We();return(0,ce.jsxs)(_e.List,{isLoading:t||i||a,searchBarPlaceholder:"Filter by ID, title, status, assignee or priority",filtering:{keepSectionOrder:!0},children:[(0,ce.jsx)(_e.List.EmptyView,{title:"No issues",description:"There are no issues created by you.",actions:(0,ce.jsx)(_e.ActionPanel,{children:(0,ce.jsx)(_e.Action.Push,{title:"Create Issue",target:(0,ce.jsx)(ht,{priorities:r,me:c})})})}),(0,ce.jsx)(ds,{mutateList:s,issues:e,priorities:r,me:c})]})}function Di(){return(0,ce.jsx)(ms,{children:(0,ce.jsx)(ur,{})})}
