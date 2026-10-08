"use strict";var qs=Object.create;var _t=Object.defineProperty;var Ws=Object.getOwnPropertyDescriptor;var Qs=Object.getOwnPropertyNames;var Bs=Object.getPrototypeOf,zs=Object.prototype.hasOwnProperty;var Gs=(e,t)=>{for(var i in t)_t(e,i,{get:t[i],enumerable:!0})},Ji=(e,t,i,s)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of Qs(t))!zs.call(e,o)&&o!==i&&_t(e,o,{get:()=>t[o],enumerable:!(s=Ws(t,o))||s.enumerable});return e};var It=(e,t,i)=>(i=e!=null?qs(Bs(e)):{},Ji(t||!e||!e.__esModule?_t(i,"default",{value:e,enumerable:!0}):i,e)),_s=e=>Ji(_t({},"__esModule",{value:!0}),e);var Tr={};Gs(Tr,{default:()=>Ns});module.exports=_s(Tr);var pt=require("@raycast/api"),zt=require("react");var Yi=It(require("fs")),eo=require("@raycast/api"),to=It(require("node-emoji"));function Oe({icon:e,color:t,fallbackIcon:i}){if(!e)return i;if(/:(.*):/.test(e))return to.get(e)??i;let o=`${eo.environment.assetsPath}/linear-icons/${e.toLowerCase()}.svg`;return Yi.default.existsSync(o)?{source:o,...t?{tintColor:{light:t,dark:t,adjustContrast:!0}}:{}}:i}function Ne(e){return Oe({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/initiative.svg",dark:"dark/initiative.svg"}}})}var ao=require("@raycast/utils");var ro=require("lodash");var io=require("@linear/sdk"),oo=require("@raycast/api"),so=require("@raycast/utils"),Mt=null;async function Hs(e,t,i,s,o){let c=JSON.stringify({query:i,variables:s}),n=new Headers(t.headers);new Headers(o).forEach((l,d)=>n.set(d,l)),n.set("Content-Type","application/json");let a=await fetch(e,{...t,method:"POST",headers:Object.fromEntries(n.entries()),body:c}),r=a.headers.get("Content-Type")?.startsWith("application/json")?await a.json():await a.text();if(typeof r!="string"&&a.ok&&!r.errors&&r.data)return{...r,headers:a.headers,status:a.status};throw new Error(typeof r=="string"?r:r.errors?.[0]?.message??`GraphQL Error (${a.status})`)}var gi=so.OAuthService.linear({scope:"read write",onAuthorize({token:e}){Mt=new io.LinearClient({accessToken:e,headers:{"public-file-urls-expire-in":"60","linear-raycast-extension-name":oo.environment.extensionName}});let t=Mt.client;t.rawRequest=((i,s,o)=>Hs(t.url,t.options,i,s,o))}});function k(){if(!Mt)throw new Error("No linear client initialized");return{linearClient:Mt,graphQLClient:Mt.client}}var Zs=`
  id
  name
  color
  icon
  description
  sortOrder
  projects {
    nodes {
      id
    }
  }
`;async function no(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        initiatives(orderBy: updatedAt) {
          nodes {
            ${Zs}
          }
        }
      }
    `);return(0,ro.sortBy)(t?.initiatives.nodes??[],i=>i.sortOrder??1/0)}function Ht(){let{data:e,error:t,isLoading:i,mutate:s}=(0,ao.useCachedPromise)(no,[],{failureToastOptions:{title:"Failed to load initiatives"},keepPreviousData:!0});return{initiatives:e,initiativesError:t,isLoadingInitiatives:!e&&!t||i,mutateInitiatives:s}}var co=require("@raycast/utils");function Ye(){let{linearClient:e}=k(),{data:t,error:i,isLoading:s}=(0,co.useCachedPromise)(()=>e.viewer);return{me:t,meError:i,isLoadingMe:!t&&!i||s}}var lo=require("@raycast/utils");function Ut(){let{linearClient:e}=k(),{data:t,error:i,isLoading:s}=(0,lo.useCachedPromise)(()=>e.issuePriorityValues,[],{initialData:[]});return{priorities:t,prioritiesError:i,isLoadingPriorities:!t&&!i||s}}var po=require("@raycast/utils");var Ks=`
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
`;async function uo({teamId:e,searchText:t="",after:i=null,first:s=null}){let{graphQLClient:o}=k(),c=`
    projects(first: $first, after: $after, filter: { name: { containsIgnoreCase: $searchText } }) {
      nodes {
        ${Ks}
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  `;if(!e){let{data:r}=await o.rawRequest(`
        query($first: Int, $after: String, $searchText: String) {
          ${c}
        }
      `,{first:s,after:i,searchText:t}),l=r?.projects;return{data:l?.nodes??[],hasMore:!!l?.pageInfo.hasNextPage,cursor:l?.pageInfo.endCursor||null}}let{data:n}=await o.rawRequest(`
      query($teamId: String!, $first: Int, $after: String, $searchText: String) {
        team(id: $teamId) {
          ${c}
        }
      }
    `,{teamId:e,first:s,after:i,searchText:t}),a=n?.team?.projects;return{data:a?.nodes??[],hasMore:!!a?.pageInfo.hasNextPage,cursor:a?.pageInfo.endCursor||null}}var Xs=`
  id
  body
  url
  health
  createdAt
  user {
    id
    displayName
    avatarUrl
    email
  }
`;async function mo(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      query($projectId: String!) {
        project(id: $projectId) {
          projectUpdates {
            nodes {
              ${Xs}
            }
          }
        }
      }
    `,{projectId:e});return i?.project.projectUpdates.nodes}function ne(e,t){let{data:i,error:s,isLoading:o,mutate:c,pagination:n}=(0,po.useCachedPromise)((a,r)=>l=>uo({teamId:a,searchText:r,after:l.cursor,first:t?.pageSize}),[e,t?.searchText],{execute:t?.execute!==!1,keepPreviousData:!0});return{projects:i,isLoadingProjects:!i&&!s||o,projectsError:s,mutateProjects:c,pagination:n}}var A=require("@raycast/api"),Es=require("@raycast/utils"),zi=require("date-fns");var yt=require("@raycast/api"),Zt=require("date-fns");function ht(e){let t=(0,Zt.differenceInDays)(e,(0,Zt.startOfToday)()),i=yt.Color.PrimaryText;return t<=7&&(i=yt.Color.Orange),t<=0&&(i=yt.Color.Red),{source:yt.Icon.Calendar,tintColor:i}}function U(e){return e instanceof Error?e.message:String(e)}var Kt={backlog:{light:"light/project-backlog.svg",dark:"dark/project-backlog.svg"},planned:{light:"light/project-planned.svg",dark:"dark/project-planned.svg"},started:{light:"light/project-started.svg",dark:"dark/project-started.svg"},paused:{light:"light/project-paused.svg",dark:"dark/project-paused.svg"},completed:{light:"light/project-completed.svg",dark:"dark/project-completed.svg"},canceled:{light:"light/project-canceled.svg",dark:"dark/project-canceled.svg"}};function K(e){return e?Oe({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:{light:"light/project.svg",dark:"dark/project.svg"}}}):{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}var Xt=require("@raycast/api"),go=require("@raycast/utils");function _(e){return e?{source:e.avatarUrl?encodeURI(e.avatarUrl):(0,go.getAvatarIcon)(e.displayName.toUpperCase()),mask:Xt.Image.Mask.Circle}:Xt.Icon.Person}var H=require("@raycast/api"),Ft=require("@raycast/utils");var le=require("react/jsx-runtime");function fi({projectId:e}){let{linearClient:t}=k(),{pop:i}=(0,H.useNavigation)(),{projects:s,isLoadingProjects:o}=ne(),{handleSubmit:c,itemProps:n,focus:a,reset:r}=(0,Ft.useForm)({async onSubmit(l){let d=await(0,H.showToast)({style:H.Toast.Style.Animated,title:"Creating Milestone"});try{let{success:f}=await t.createProjectMilestone({projectId:l.projectId,name:l.name,description:l.description,...l.targetDate?{targetDate:l.targetDate}:{}});f&&(d.style=H.Toast.Style.Success,d.title="Created Milestone",r({projectId:"",name:"",description:"",targetDate:null}),a("projectId"),i())}catch(f){d.style=H.Toast.Style.Failure,d.title="Failed to create milestone",d.message=U(f)}},validation:{projectId:Ft.FormValidation.Required,name:Ft.FormValidation.Required},initialValues:{projectId:e,name:"",description:"",targetDate:null}});return(0,le.jsxs)(H.Form,{isLoading:o,actions:(0,le.jsx)(H.ActionPanel,{children:(0,le.jsx)(H.Action.SubmitForm,{title:"Create Milestone",onSubmit:c})}),children:[(0,le.jsx)(H.Form.Dropdown,{title:"Project",storeValue:!0,...n.projectId,children:s?.map(l=>(0,le.jsx)(H.Form.Dropdown.Item,{value:l.id,title:l.name,icon:K(l)},l.id))}),(0,le.jsx)(H.Form.Separator,{}),(0,le.jsx)(H.Form.TextField,{title:"Name",placeholder:"Milestone name",...n.name}),(0,le.jsx)(H.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...n.description}),(0,le.jsx)(H.Form.Separator,{}),(0,le.jsx)(H.Form.DatePicker,{title:"Target Date",type:H.Form.DatePicker.Type.Date,...n.targetDate})]})}var x=require("@raycast/api"),Et=require("@raycast/utils"),So=require("react");var fo=require("@raycast/api");function Pt(e,t){let i=t?.logoUrl?encodeURI(t.logoUrl):fo.Icon.TwoPeople;return Oe({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:i})}var Io=require("@raycast/utils");function Ii(){let{linearClient:e}=k(),{data:t,isLoading:i}=(0,Io.useCachedPromise)(async()=>(await e.projectStatuses()).nodes.sort((o,c)=>o.position-c.position));return{states:t,isLoadingStates:i}}var Po=require("@raycast/utils");var yo=require("lodash");async function ho(e=""){let{graphQLClient:t,linearClient:i}=k(),s=await i.viewer,{data:o}=await t.rawRequest(`
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
    `,{userId:s.id,query:e}),c=(0,yo.sortBy)(o?.teams.nodes??[],r=>r.membership?.sortOrder??1/0),n=o?.organization,a=!!o?.teams.pageInfo.hasNextPage;return{teams:c,organization:n,hasMoreTeams:a}}function et(e=""){let{data:t,error:i,isLoading:s}=(0,Po.useCachedPromise)(ho,[e]);return{teams:t?.teams,org:t?.organization,teamsError:i,isLoadingTeams:!t&&!i||s,supportsTeamTypeahead:e.trim().length>0||t?.hasMoreTeams}}var ko=require("@raycast/utils");function be(e=""){let{linearClient:t}=k(),{data:i,error:s,isLoading:o}=(0,ko.useCachedPromise)(async c=>{let n=await t.users(c.trim().length>0?{filter:{name:{containsIgnoreCase:c}}}:void 0);return{users:n?.nodes??[],hasMoreUsers:!!n?.pageInfo?.hasNextPage}},[e],{initialData:[]});return{users:i?.users,supportsUserTypeahead:e.trim().length>0||i?.hasMoreUsers,usersError:s,isLoadingUsers:!i&&!s||o}}var X=require("react/jsx-runtime");function yi({project:e,mutateProjects:t}){let{linearClient:i}=k(),{pop:s}=(0,x.useNavigation)(),{teams:o,org:c,isLoadingTeams:n}=et(),{users:a,isLoadingUsers:r}=be(),{states:l,isLoadingStates:d}=Ii(),[f,D]=(0,So.useState)(""),{users:C,supportsUserTypeahead:y,isLoadingUsers:P}=be(f),{handleSubmit:oe,itemProps:v}=(0,Et.useForm)({async onSubmit(g){let M=await(0,x.showToast)({style:x.Toast.Style.Animated,title:"Editing project"});try{let{success:N}=await i.updateProject(e.id,{teamIds:g.teamIds,name:g.name,description:g.description,statusId:g.statusId,memberIds:g.memberIds,...g.leadId?{leadId:g.leadId}:{},...g.startDate?{startDate:g.startDate}:{},...g.targetDate?{targetDate:g.targetDate}:{}});N&&(M.style=x.Toast.Style.Success,M.title="Edited Project",s(),t())}catch(N){M.style=x.Toast.Style.Failure,M.title="Failed to edit project",M.message=U(N)}},validation:{teamIds:Et.FormValidation.Required,name:Et.FormValidation.Required},initialValues:{teamIds:e.teams.nodes.map(g=>g.id)||[],name:e.name,description:e.description,statusId:e.status.id,leadId:e.lead?.id,memberIds:e.members.nodes.map(g=>g.id)||[],startDate:e.startDate?new Date(e.startDate):null,targetDate:e.targetDate?new Date(e.targetDate):null}});return(0,X.jsxs)(x.Form,{isLoading:n||r||P||d,actions:(0,X.jsx)(x.ActionPanel,{children:(0,X.jsx)(x.Action.SubmitForm,{title:"Edit Project",onSubmit:oe})}),children:[(0,X.jsx)(x.Form.TagPicker,{title:"Team(s)",placeholder:"Add team",...v.teamIds,children:o?.map(g=>(0,X.jsx)(x.Form.TagPicker.Item,{value:g.id,title:g.name,icon:Pt(g,c)},g.id))}),(0,X.jsx)(x.Form.Separator,{}),(0,X.jsx)(x.Form.TextField,{title:"Name",placeholder:"Project name",...v.name}),(0,X.jsx)(x.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...v.description}),(0,X.jsx)(x.Form.Separator,{}),(0,X.jsx)(x.Form.Dropdown,{title:"Status",...v.statusId,children:l?.map(g=>(0,X.jsx)(x.Form.Dropdown.Item,{value:g.id,title:g.name,icon:{source:Kt[g.type],tintColor:g.color}},g.id))}),(0,X.jsxs)(x.Form.Dropdown,{title:"Lead",...v.leadId,...y&&{onSearchTextChange:D,isLoading:P,throttle:!0},children:[(0,X.jsx)(x.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:x.Icon.Person}),C?.map(g=>(0,X.jsx)(x.Form.Dropdown.Item,{title:g.name,value:g.id,icon:_(g)},g.id))]}),a&&a.length>0?(0,X.jsx)(x.Form.TagPicker,{title:"Members",placeholder:"Add members",...v.memberIds,children:a?.map(g=>(0,X.jsx)(x.Form.TagPicker.Item,{value:g.id,title:g.name,icon:_(g)},g.id))}):null,(0,X.jsx)(x.Form.DatePicker,{title:"Start Date",type:x.Form.DatePicker.Type.Date,...v.startDate}),(0,X.jsx)(x.Form.DatePicker,{title:"Target Date",type:x.Form.DatePicker.Type.Date,...v.targetDate})]})}var hi=require("@raycast/api");var Co=require("@raycast/api"),Ot=!1;async function wo(){Ot=!!(await(0,Co.getApplications)()).find(i=>i.bundleId==="com.linear")}var Pi=require("react/jsx-runtime");function pe({title:e,url:t,...i}){return Ot?(0,Pi.jsx)(hi.Action.Open,{title:`${e||"Open"} in Linear`,icon:"linear-app-icon.png",target:t,application:"Linear",...i}):(0,Pi.jsx)(hi.Action.OpenInBrowser,{url:t,title:`${e||"Open"} in Browser`})}var Se=require("@raycast/api"),Ps=require("@raycast/utils"),ks=require("react");var bo=require("@raycast/api");async function ki(e,t,i,s,o){let c=s,n=!0,a,r=0;for(;n&&r<o;){let l=await e(a);c=i(c,l),n=t(l)?.hasNextPage,a=t(l)?.endCursor,r++}return c}var Js=(0,bo.getPreferenceValues)();function Si({inFilterBlock:e,addComma:t,inParentheses:i}={inFilterBlock:!1,inParentheses:!1,addComma:!0}){return Js.shouldHideRedundantIssues?[...i?["("]:[],...t?[", "]:[],...e?[]:["filter: { "],"completedAt: { null: true }, canceledAt: { null: true }",...e?[]:[" }"],...i?[")"]:[]].join(""):""}var kt=`
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
`;async function St(){let{graphQLClient:e}=k(),{data:t}=await e.rawRequest(`
      query {
        issues(orderBy: createdAt${Si()}) {
          nodes {
            ${kt}
          }
        }
      }
    `);return t?.issues.nodes}async function Do(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      query($projectId: ID) {
        issues(filter: { project: { id: { eq: $projectId } }${Si({inFilterBlock:!0,addComma:!0})} } ) {
          nodes {
            ${kt}
          }
        }
      }
    `,{projectId:e});return i?.issues.nodes}async function Ao(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          children${Si({inParentheses:!0})} {
            nodes {
              ${kt}
              sortOrder
            }
          }
        }
      }
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue.children.nodes}async function Lo(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
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
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue}async function To(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
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
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue.comments.nodes}async function vo(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      query($issueId: String!) {
        issue(id: $issueId) {
          ${kt}
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
    `,{issueId:e});if(!i)throw new Error("Cannot find the Linear issue");return i.issue}var Ci=require("@raycast/api");function De(e){return e?{source:"linear-icons/milestone.svg",tintColor:Ci.Color.PrimaryText}:{source:"linear-icons/no-milestone.svg",tintColor:Ci.Color.SecondaryText}}var $o=require("@raycast/utils");function ge(e,t=[],i){let{data:s,error:o,isLoading:c,mutate:n}=(0,$o.useCachedPromise)(e,t,i);return{issues:s,issuesError:o,isLoadingIssues:c,mutateList:n}}var jo=require("@raycast/utils");var Ys=`
  id
  name
  targetDate
  project {
      id
  }
  sortOrder
  updatedAt
`;async function Ro(e){let{graphQLClient:t}=k();if(e){let{data:i}=await t.rawRequest(`
        query($projectId: String!) {
          project(id: $projectId) {
            projectMilestones {
              nodes {
                ${Ys}
              }
            }
          }
        }
      `,{projectId:e});return i?.project.projectMilestones.nodes}return null}function $e(e,t){let{data:i,error:s,isLoading:o,mutate:c}=(0,jo.useCachedPromise)(Ro,[e],{execute:t?.execute!==!1});return{milestones:i,isLoadingMilestones:!i&&!s||o,milestonesError:s,mutateMilestones:c}}var u=require("@raycast/api"),ut=require("@raycast/utils"),_e=require("react");var xo=require("fs/promises"),wi=It(require("path"));var er="application/octet-stream",tr={".apng":"image/apng",".avif":"image/avif",".bmp":"image/bmp",".csv":"text/csv",".doc":"application/msword",".docx":"application/vnd.openxmlformats-officedocument.wordprocessingml.document",".gif":"image/gif",".gz":"application/gzip",".heic":"image/heic",".heif":"image/heif",".ico":"image/x-icon",".jpeg":"image/jpeg",".jpg":"image/jpeg",".json":"application/json",".md":"text/markdown",".mov":"video/quicktime",".mp3":"audio/mpeg",".mp4":"video/mp4",".pdf":"application/pdf",".png":"image/png",".ppt":"application/vnd.ms-powerpoint",".pptx":"application/vnd.openxmlformats-officedocument.presentationml.presentation",".svg":"image/svg+xml",".tar":"application/x-tar",".tif":"image/tiff",".tiff":"image/tiff",".txt":"text/plain",".webm":"video/webm",".webp":"image/webp",".xls":"application/vnd.ms-excel",".xlsx":"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",".zip":"application/zip"};function ir(e){return tr[wi.default.extname(e).toLowerCase()]??er}async function or(e){let{graphQLClient:t}=k(),i=await(0,xo.readFile)(e),s=ir(e),o=wi.default.basename(e),{data:c}=await t.rawRequest(`
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
    `,{size:i.byteLength,contentType:s,filename:o}),n=c?.fileUpload.uploadFile;if(!c?.fileUpload.success||!n)throw new Error(`Failed to request an upload URL for "${o}"`);let a=new Headers({"Content-Type":s,"Cache-Control":"public, max-age=31536000"});n.headers.forEach(({key:l,value:d})=>a.set(l,d));let r=await fetch(n.uploadUrl,{method:"PUT",headers:a,body:i});if(!r.ok)throw new Error(`Failed to upload "${o}": ${r.status} ${r.statusText}`);return{assetUrl:n.assetUrl,contentType:s,name:o}}async function Jt(e){let{linearClient:t}=k(),i=await or(e.url),s=await t.createAttachment({issueId:e.issueId,title:i.name,url:i.assetUrl});return{success:s.success,id:s.attachmentId}}async function Yt(e){let{linearClient:t}=k(),i=await t.attachmentLinkURL(e.issueId,e.url);return{success:i.success,id:i.attachmentId}}async function Mo(e){let{graphQLClient:t}=k(),i=e.title.replace(/"/g,"\\$&"),s=e.description?.replace(/\n/g,"\\n")?.replace(/"/g,"\\$&"),o=`teamId: "${e.teamId}", title: "${i}", description: "${s}", priority: ${e.priority}`;e.stateId&&(o+=`, stateId: "${e.stateId}"`),e.estimate&&(o+=`, estimate: ${e.estimate}`),e.assigneeId&&(o+=`, assigneeId: "${e.assigneeId}"`),e.labelIds&&e.labelIds.length>0&&(o+=`, labelIds: [${e.labelIds.map(n=>`"${n}"`).join(",")}]`),e.dueDate&&(o+=`, dueDate: "${e.dueDate.toISOString()}"`),e.cycleId&&(o+=`, cycleId: "${e.cycleId}"`),e.projectId&&(o+=`, projectId: "${e.projectId}"`),e.projectId&&e.projectMilestoneId&&(o+=`, projectMilestoneId: "${e.projectMilestoneId}"`),e.parentId&&(o+=`, parentId: "${e.parentId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${o}}) {
          success
          issue {
            ${kt}
          }
        }
      }
    `);return{success:c?.issueCreate.success,issue:c?.issueCreate.issue}}async function Uo(e){let{graphQLClient:t}=k(),i=e.title.replace(/"/g,"\\$&"),s=e.description?.replace(/\n/g,"\\n").replace(/"/g,"\\$&"),o=`teamId: "${e.teamId}", title: "${i}", description: "${s}", parentId: "${e.parentId}"`;e.stateId&&(o+=`, stateId: "${e.stateId}"`);let{data:c}=await t.rawRequest(`
      mutation {
        issueCreate(input: {${o}}) {
          success
        }
      }
    `);return{success:c?.issueCreate.success}}var Ae=require("date-fns"),sr=10080*60*1e3;function tt(e){let t=Date.now(),i=Date.now()+sr,s=new Date(e.startsAt),o=new Date(e.endsAt),c=!e.completedAt&&(0,Ae.isBefore)(s,t)&&(0,Ae.isAfter)(o,t),n=!e.completedAt&&(0,Ae.isBefore)(s,i)&&(0,Ae.isAfter)(o,i),a=c?{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}:{light:"light/cycle.svg",dark:"dark/cycle.svg"},r=`Cycle ${e.number} (${(0,Ae.format)(s,"dd MMM")} - ${(0,Ae.format)(o,"dd MMM")})`,l=c?`Active ${r}`:r;return{...e,isActive:c,isNext:n,icon:a,title:l}}function Ve(e){return e.filter(t=>(0,Ae.isAfter)(new Date(t.endsAt),Date.now())).map(tt)}var Fo={exponential:[0,1,2,4,8,16,32,64],fibonacci:[0,1,2,3,5,8,13,21],linear:[0,1,2,3,4,5,6,7],tShirt:[0,1,2,3,5,8,13,21]},Eo={0:"\u2013",1:"XS",2:"S",3:"M",5:"L",8:"XL",13:"XXL",21:"XXXL"};function ei({estimate:e,issueEstimationType:t}){if(!e)return"Not estimated";if(t==="tShirt"){let i=Eo[e];return i||String(e)}return String(e)}function Ct({issueEstimationType:e,issueEstimationAllowZero:t,issueEstimationExtended:i}){if(e==="notUsed")return null;let s=t?0:1,o=i?Fo[e].length:6,c=Fo[e].slice(s,o);return e==="tShirt"?c.map(n=>({estimate:n,label:Eo[n]})):c.map(n=>({estimate:n,label:n!==1?`${n} points`:`${n} point`}))}function bi(e={}){return{title:"",description:"",stateId:"",priority:"",assigneeId:"",labelIds:[],estimate:"",dueDate:null,cycleId:"",projectId:"",milestoneId:"",...e}}function rr(e){if(typeof e=="string")try{let t=JSON.parse(e);return typeof t=="object"&&t!==null?t:{}}catch{return{}}return typeof e=="object"&&e!==null?e:{}}function qe(e){return typeof e=="string"?e:void 0}function Oo(e){return typeof e=="number"?String(e):qe(e)}function No(e){if(!Array.isArray(e))return;let t=e.filter(i=>typeof i=="string");return t.length>0?t:void 0}function nr(e){if(typeof e!="string")return;let t=new Date(e);return Number.isNaN(t.getTime())?void 0:t}function Vo(e,t={}){let i=rr(e.templateData),s=bi(t),o=No(i.labelIds)??No(i.labels);return{title:qe(i.title)??s.title,description:qe(i.description)??s.description,stateId:qe(i.stateId)??qe(i.statusId)??s.stateId,priority:Oo(i.priority)??s.priority,assigneeId:qe(i.assigneeId)??s.assigneeId,labelIds:o??s.labelIds,estimate:Oo(i.estimate)??s.estimate,dueDate:i.dueDate!==void 0?nr(i.dueDate)??null:s.dueDate,cycleId:qe(i.cycleId)??s.cycleId,projectId:qe(i.projectId)??s.projectId,milestoneId:s.milestoneId}}function ti(e){let t=e.split(`
`),i=/https?:\/\/\S+/,s=t.map(o=>o.trim()).filter(o=>i.test(o));return Array.from(new Set(s))}var Le={0:{light:"light/priority-no-priority.svg",dark:"dark/priority-no-priority.svg"},1:{light:"light/priority-urgent.svg",dark:"dark/priority-urgent.svg"},2:{light:"light/priority-high.svg",dark:"dark/priority-high.svg"},3:{light:"light/priority-medium.svg",dark:"dark/priority-medium.svg"},4:{light:"light/priority-low.svg",dark:"dark/priority-low.svg"}};var qo=require("lodash");var ar={triage:{light:"light/triage.svg",dark:"dark/triage.svg"},backlog:{light:"light/backlog.svg",dark:"dark/backlog.svg"},unstarted:{light:"light/unstarted.svg",dark:"dark/unstarted.svg"},started:{light:"light/started.svg",dark:"dark/started.svg"},completed:{light:"light/completed.svg",dark:"dark/completed.svg"},canceled:{light:"light/canceled.svg",dark:"dark/canceled.svg"}};function ie(e){return{source:ar[e.type],tintColor:{light:e.color,dark:e.color,adjustContrast:!0}}}function We(e,t=["triage","backlog","unstarted","started","completed","canceled"]){if(e.length===0)return[];let i=(0,qo.groupBy)(e,s=>s.type);return t.filter(s=>!!i[s]).map(s=>i[s]).flat()}var Wo=require("@raycast/utils");function it(e,t){let{linearClient:i}=k(),{data:s,error:o,isLoading:c}=(0,Wo.useCachedPromise)(async n=>(await i.cycles({filter:{team:{id:{eq:n}}}})).nodes.sort((r,l)=>r.number-l.number),[e],{execute:t?.execute!==!1&&!!e});return{cycles:s,cyclesError:o,isLoadingCycles:!s&&!o||c}}var zo=require("@raycast/utils");var Qo=`
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
`;function cr(e,t){let i=e.type.toLowerCase()==="issue",s=!e.team||e.team.id===t;return i&&!e.archivedAt&&s}function lr(e,t){return(e.sortOrder??0)-(t.sortOrder??0)||e.name.localeCompare(t.name)}async function Bo(e){if(!e)return[];let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      query IssueTemplates($teamId: String!, $first: Int) {
        organization {
          templates(first: $first) {
            nodes {
              ${Qo}
            }
          }
        }
        team(id: $teamId) {
          templates(first: $first) {
            nodes {
              ${Qo}
            }
          }
        }
      }
    `,{teamId:e,first:100});return[...i?.organization?.templates?.nodes??[],...i?.team?.templates?.nodes??[]].filter((o,c,n)=>n.findIndex(a=>a.id===o.id)===c).filter(o=>cr(o,e)).sort(lr)}function Di(e,t){let{data:i,error:s,isLoading:o}=(0,zo.useCachedPromise)(Bo,[e],{execute:t?.execute!==!1&&!!e});return{issueTemplates:i,issueTemplatesError:s,isLoadingIssueTemplates:!i&&!s||o}}var Ho=require("@raycast/utils");var Go=require("@raycast/api");var dr=100,ur=100,mr=(0,Go.getPreferenceValues)();function pr(){let e=Number(mr.labelsLimit),t=Number.isFinite(e)&&e>0?e:ur,i=Math.floor(Math.min(dr,t)),s=Math.ceil(t/i);return{pageSize:i,pageLimit:s}}async function _o(e){if(!e)return[];let{pageSize:t,pageLimit:i}=pr(),{graphQLClient:s}=k();return ki(async o=>s.rawRequest(`
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
        `,{teamId:e,cursor:o}),o=>o.data?.team?.labels?.pageInfo,(o,c)=>o.concat(c.data?.team?.labels?.nodes??[]),[],i)}function ot(e,t){let{data:i,error:s,isLoading:o}=(0,Ho.useCachedPromise)(_o,[e],{execute:t?.execute!==!1&&!!e});return{labels:i,labelsError:s,isLoadingLabels:!i&&!s||o}}var Zo=require("@raycast/utils");function Re(e,t){let{linearClient:i}=k(),{data:s,error:o,isLoading:c}=(0,Zo.useCachedPromise)(async n=>(await i.workflowStates({filter:{team:{id:{eq:n}}}})).nodes.sort((r,l)=>r.position-l.position),[e],{initialData:[],execute:t?.execute!==!1});return{states:s,isLoadingStates:c,statesError:o}}var V=require("@raycast/api"),ys=require("date-fns");var Ko=require("@raycast/utils");function st(e){let t=e.id,{data:i,error:s,isLoading:o,mutate:c}=(0,Ko.useCachedPromise)(vo,[t],{initialData:{...e,description:""}});return{issue:i,issueError:s,isLoadingIssue:o,mutateDetail:c}}var I=require("@raycast/api"),Ni=require("date-fns"),Is=require("react");var R=require("@raycast/api"),Xo=require("@raycast/utils"),Jo=require("nanoid"),rt=require("react");var fe=require("react/jsx-runtime");function Ai({issue:e}){let{pop:t}=(0,R.useNavigation)(),{states:i}=Re(e.team.id),s=(0,rt.useMemo)(()=>i.filter(P=>P.type==="unstarted")[0],[i]),{issue:o,isLoadingIssue:c}=st(e),{data:n,isLoading:a,revalidate:r}=(0,Xo.useAI)(`Act as a product manager for Linear issues. Break down a Linear issue into a list of sub-issues. 
    
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

${o.description?`To give you more context and help in creating sub-issues, here's the Linear issue description:
"""
${o.description}
"""
`:""}

Break down the Linear issue with this title: "${o.title}"`,{execute:!!o&&!c,creativity:.5}),[l,d]=(0,rt.useState)(!1),[f,D]=(0,rt.useState)([]);(0,rt.useEffect)(()=>{if(!(!n||a)){try{let y=/\[[\s\S]*?\]/,P=n.match(y);if(P&&P[0]){let oe=JSON.parse(P[0]);D(oe.map(v=>({...v,id:(0,Jo.nanoid)(),selected:!0})))}}catch(y){(0,R.showToast)({style:R.Toast.Style.Failure,title:"Failed to parse AI results",message:U(y),primaryAction:{title:"Retry",onAction:r},secondaryAction:{title:"Copy AI Result",onAction:()=>R.Clipboard.copy(n)}})}d(!0)}},[n,a]);async function C(){try{await(0,R.showToast)({style:R.Toast.Style.Animated,title:"Creating sub-issues"});let y=f.filter(P=>P.selected);await Promise.all(y.map(P=>Uo({teamId:o.team.id,title:P.title,description:P.description,parentId:o.id,stateId:s?.id}))),await(0,R.showToast)({style:R.Toast.Style.Success,title:"Created sub-issues"}),t()}catch(y){(0,R.showToast)({style:R.Toast.Style.Failure,title:"Failed to create Sub-Issues",message:U(y)})}}return(0,fe.jsxs)(R.List,{isLoading:a||!l,children:[f?.map(y=>(0,fe.jsx)(R.List.Item,{icon:y.selected?{source:R.Icon.CheckCircle,tintColor:R.Color.Green}:R.Icon.Circle,title:y.title,subtitle:y.description,actions:(0,fe.jsxs)(R.ActionPanel,{children:[(0,fe.jsx)(R.Action,{title:y.selected?"Unselect Sub-Issue":"Select Sub-Issue",icon:y.selected?R.Icon.Circle:{source:R.Icon.CheckCircle,tintColor:R.Color.Green},onAction:()=>D(f.map(P=>P.id===y.id?{...P,selected:!P.selected}:P))}),(0,fe.jsx)(R.Action,{title:"Create Sub-Issues",icon:R.Icon.Plus,onAction:()=>C()}),(0,fe.jsx)(R.Action,{title:"Generate New Sub-Issues",icon:R.Icon.ArrowClockwise,onAction:r})]})},y.title)),(0,fe.jsx)(R.List.EmptyView,{title:"No sub-issues were generated. Try again.",actions:(0,fe.jsx)(R.ActionPanel,{children:(0,fe.jsx)(R.Action,{title:"Retry",icon:R.Icon.ArrowClockwise,onAction:r})})})]})}var w=require("@raycast/api"),nt=require("@raycast/utils"),Nt=require("react");async function Yo(e,t){let{graphQLClient:i}=k(),s=[];if(t.teamId&&s.push(`teamId: "${t.teamId}"`),t.title&&s.push(`title: "${t.title.replace(/"/g,"\\$&")}"`),t.description&&s.push(`description: "${t.description.replace(/\n/g,"\\n").replace(/"/g,"\\$&")}"`),t.stateId&&s.push(`stateId: "${t.stateId}"`),typeof t.priority<"u"&&s.push(`priority: ${t.priority}`),typeof t.assigneeId<"u"&&s.push(`assigneeId: ${t.assigneeId?`"${t.assigneeId}"`:null}`),t.labelIds&&s.push(`labelIds: [${t.labelIds.map(c=>`"${c}"`).join(",")}]`),typeof t.estimate<"u"&&s.push(`estimate: ${t.estimate}`),typeof t.dueDate<"u"){let c=t.dueDate?t.dueDate instanceof Date?t.dueDate.toISOString():t.dueDate:null;s.push(`dueDate: ${c?`"${c}"`:null}`)}typeof t.cycleId<"u"&&s.push(`cycleId: ${t.cycleId?`"${t.cycleId}"`:null}`),typeof t.projectId<"u"&&s.push(`projectId: ${t.projectId?`"${t.projectId}"`:null}`),typeof t.projectMilestoneId<"u"&&s.push(`projectMilestoneId: ${t.projectMilestoneId?`"${t.projectMilestoneId}"`:null}`),typeof t.parentId<"u"&&s.push(`parentId: ${t.parentId?`"${t.parentId}"`:null}`);let{data:o}=await i.rawRequest(`
      mutation {
        issueUpdate(id: "${e}", input: {${s.join(", ")}}) {
          success
        }
      }
    `);return{success:o?.issueUpdate.success}}var $=require("react/jsx-runtime");function Li(e){let{pop:t}=(0,w.useNavigation)(),{issue:i,isLoadingIssue:s,mutateDetail:o}=st(e.issue),[c,n]=(0,Nt.useState)(""),{teams:a,org:r,supportsTeamTypeahead:l,isLoadingTeams:d}=et(c),f=a&&a.length>1,[D,C]=(0,Nt.useState)(""),{users:y,supportsUserTypeahead:P,isLoadingUsers:oe}=be(D),{handleSubmit:v,itemProps:g,values:M,setValue:N}=(0,nt.useForm)({async onSubmit(p){let re=await(0,w.showToast)({style:w.Toast.Style.Animated,title:"Editing issue"});try{let ve={teamId:p.teamId||e.issue.team.id,title:p.title,description:p.description,stateId:p.stateId,labelIds:p.labelIds,dueDate:p.dueDate,...ee&&p.estimate?{estimate:parseInt(p.estimate)}:{},...p.assigneeId?{assigneeId:p.assigneeId}:{},...p.cycleId?{cycleId:p.cycleId}:{},...p.projectId?{projectId:p.projectId}:{},...p.milestoneId?{projectMilestoneId:p.milestoneId}:{},...p.parentId?{parentId:p.parentId}:{},priority:parseInt(p.priority)},{success:xt}=await Yo(i.id,ve);xt&&(re.style=w.Toast.Style.Success,re.title=`Edited Issue \u2022 ${i.identifier}`,t(),o(),e.mutateList&&e.mutateList(),e.mutateSubIssues&&e.mutateSubIssues())}catch(ve){re.style=w.Toast.Style.Failure,re.title="Failed to edit issue",re.message=U(ve)}},validation:{teamId:f?nt.FormValidation.Required:void 0,title:nt.FormValidation.Required,stateId:nt.FormValidation.Required,priority:nt.FormValidation.Required},initialValues:{teamId:e.issue.team.id,title:e.issue.title,description:i.description??void 0,priority:String(e.issue.priority),stateId:e.issue.state.id,estimate:e.issue.estimate?String(e.issue.estimate):void 0,assigneeId:e.issue.assignee?.id,labelIds:e.issue.labels.nodes.map(p=>p.id),dueDate:i.dueDate?new Date(i.dueDate):null,cycleId:e.issue.cycle?.id,projectId:e.issue.project?.id,milestoneId:e.issue.projectMilestone?.id,parentId:e.issue.parent?.id}});(0,Nt.useEffect)(()=>{N("description",i.description||""),N("dueDate",i.dueDate?new Date(i.dueDate):null)},[i]);let Te=!!M.teamId&&M.teamId.trim().length>0,{states:He}=Re(M.teamId,{execute:Te}),{labels:se}=ot(M.teamId,{execute:Te}),{cycles:we}=it(M.teamId,{execute:Te}),{issues:Fe}=ge(St,[],{execute:Te}),{projects:S}=ne(M.teamId,{execute:Te}),{milestones:j}=$e(M.projectId,{execute:!!M.projectId}),F=a?.find(p=>p.id===M.teamId),ee=F?Ct({issueEstimationType:F.issueEstimationType,issueEstimationAllowZero:F.issueEstimationAllowZero,issueEstimationExtended:F.issueEstimationExtended}):null,Ze=We(He||[]),Ke=He&&He.length>0,gt=e.priorities&&e.priorities.length>0,me=se&&se.length>0,Q=we&&we.length>0,B=S&&S.length>0,di=j&&j.length>0,Gt=Fe&&Fe.length>0;return(0,$.jsxs)(w.Form,{actions:(0,$.jsx)(w.ActionPanel,{children:(0,$.jsx)(w.Action.SubmitForm,{onSubmit:v,title:"Edit Issue"})}),isLoading:d||s||oe,children:[(l||f)&&(0,$.jsxs)($.Fragment,{children:[(0,$.jsx)(w.Form.Dropdown,{title:"Team",...g.teamId,...l&&{onSearchTextChange:n,isLoading:d,throttle:!0},children:a?.map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:p.name,value:p.id,icon:Pt(p,r)},p.id))}),(0,$.jsx)(w.Form.Separator,{})]}),(0,$.jsx)(w.Form.TextField,{title:"Title",placeholder:"Issue title",autoFocus:!0,...g.title}),(0,$.jsx)(w.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",...g.description}),(0,$.jsx)(w.Form.Dropdown,{title:"Status",...g.stateId,children:Ke?Ze.map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:p.name,value:p.id,icon:ie(p)},p.id)):null}),(0,$.jsx)(w.Form.Dropdown,{title:"Priority",...g.priority,children:gt?e.priorities?.map(({priority:p,label:re})=>(0,$.jsx)(w.Form.Dropdown.Item,{title:re,value:String(p),icon:{source:Le[p]}},p)):null}),(0,$.jsxs)(w.Form.Dropdown,{title:"Assignee",...g.assigneeId,...P&&{onSearchTextChange:C,isLoading:oe,throttle:!0},children:[(0,$.jsx)(w.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:w.Icon.Person}),y?.map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:p.name,value:p.id,icon:_(p)},p.id))]}),(0,$.jsx)(w.Form.TagPicker,{title:"Labels",...g.labelIds,placeholder:"Add label",children:me?se.map(({id:p,name:re,color:ve})=>(0,$.jsx)(w.Form.TagPicker.Item,{title:re,value:p,icon:{source:w.Icon.Dot,tintColor:ve}},p)):null}),ee?(0,$.jsxs)(w.Form.Dropdown,{title:"Estimate",...g.estimate,children:[(0,$.jsx)(w.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),ee.map(({estimate:p,label:re})=>(0,$.jsx)(w.Form.Dropdown.Item,{title:re,value:String(p),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},p))]}):null,(0,$.jsx)(w.Form.DatePicker,{title:"Due Date",type:w.Form.DatePicker.Type.Date,...g.dueDate}),Q||B||Gt?(0,$.jsx)(w.Form.Separator,{}):null,Q?(0,$.jsxs)(w.Form.Dropdown,{title:"Cycle",...g.cycleId,children:[(0,$.jsx)(w.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),Ve(we).map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:p.title,value:p.id,icon:{source:p.icon}},p.id))]}):null,B?(0,$.jsxs)(w.Form.Dropdown,{title:"Project",...g.projectId,children:[(0,$.jsx)(w.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),S.map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:`${p.name} (${p.status.name})`,value:p.id,icon:K(p)},p.id))]}):null,di?(0,$.jsxs)(w.Form.Dropdown,{title:"Milestone",storeValue:!0,...g.milestoneId,children:[(0,$.jsx)(w.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),j.map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:`${p.name}  (${p.targetDate||"No Target Date"})`,value:p.id,icon:De(p)},p.id))]}):null,Gt?(0,$.jsxs)(w.Form.Dropdown,{title:"Parent",...g.parentId,children:[(0,$.jsx)(w.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),Fe.map(p=>(0,$.jsx)(w.Form.Dropdown.Item,{title:`${p.identifier} - ${p.title}`,value:p.id,icon:ie(p.state)},p.id))]}):null]})}var Ie=require("@raycast/api"),ts=require("date-fns");var z=require("@raycast/api"),es=require("@raycast/utils");var Qe=require("react/jsx-runtime");function ii({issue:{id:e,title:t,identifier:i}}){let{pop:s}=(0,z.useNavigation)(),{reset:o,itemProps:c,handleSubmit:n}=(0,es.useForm)({onSubmit:async a=>{let r=await(0,z.showToast)({style:z.Toast.Style.Animated,title:"Attaching links"}),l=ti(a.links);if(l.length===0&&a.attachments.length===0){r.style=z.Toast.Style.Failure,r.title="No links or attachments provided";return}if(l.length>0){let d=l.length===1?"link":"links";try{await Promise.all(l.map(f=>Yt({issueId:e,url:f}))),r.style=z.Toast.Style.Success,r.title=`Successfully attached ${d}`}catch(f){r.style=z.Toast.Style.Failure,r.title=`Failed attaching ${d}`,r.message=U(f)}}if(a.attachments.length>0){let d=a.attachments.length===1?"attachment":"attachments";try{r.style=z.Toast.Style.Animated,r.title=`Uploading ${d}\u2026`,await Promise.all(a.attachments.map(f=>Jt({issueId:e,url:f}))),r.style=z.Toast.Style.Success,r.title=`Successfully uploaded ${d}`}catch(f){r.style=z.Toast.Style.Failure,r.title=`Failed uploading ${d}`,r.message=U(f)}}o({attachments:[],links:""}),s()},initialValues:{links:""}});return(0,Qe.jsxs)(z.Form,{actions:(0,Qe.jsx)(z.ActionPanel,{children:(0,Qe.jsx)(z.Action.SubmitForm,{onSubmit:n,icon:z.Icon.NewDocument,title:"Attach"})}),navigationTitle:"Add Attachments and Links",children:[(0,Qe.jsx)(z.Form.Description,{title:"Issue",text:`[${i}] ${t}`}),(0,Qe.jsx)(z.Form.FilePicker,{title:"Attachment",...c.attachments}),(0,Qe.jsx)(z.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...c.links})]})}var Be=require("react/jsx-runtime");function Ti({attachments:e,issue:t}){return(0,Be.jsx)(Ie.List,{navigationTitle:`Links for ${t.identifier}`,children:e.map(i=>{let s=new Date(i.updatedAt);return(0,Be.jsx)(Ie.List.Item,{icon:i.source?.imageUrl??Ie.Icon.Link,title:i.title,subtitle:i.subtitle,accessories:[{date:s,tooltip:`Updated: ${(0,ts.format)(s,"EEEE d MMMM yyyy 'at' HH:mm")}`}],actions:(0,Be.jsxs)(Ie.ActionPanel,{children:[(0,Be.jsx)(Ie.Action.OpenInBrowser,{url:i.url}),(0,Be.jsx)(Ie.Action.Push,{title:"Add Attachments and Links",icon:Ie.Icon.NewDocument,target:(0,Be.jsx)(ii,{issue:t})})]})},i.id)})})}var J=require("@raycast/api"),is=require("react");var Vt=require("react/jsx-runtime");function at({comment:e,issue:t,mutateComments:i}){let{linearClient:s}=k(),{pop:o}=(0,J.useNavigation)(),[c,n]=(0,is.useState)(e?e.body:"");async function a(){await(0,J.showToast)({style:J.Toast.Style.Animated,title:`${e?"Updating":"Adding"} comment`});try{e?await s.updateComment(e.id,{body:c}):await s.createComment({body:c,issueId:t.id}),await(0,J.showToast)({style:J.Toast.Style.Success,title:`${e?"Updated":"Added"} comment`}),o(),i&&i()}catch(r){(0,J.showToast)({style:J.Toast.Style.Failure,title:`Failed to ${e?"update":"add"} comment`,message:U(r)})}}return(0,Vt.jsx)(J.Form,{actions:(0,Vt.jsx)(J.ActionPanel,{children:(0,Vt.jsx)(J.Action.SubmitForm,{title:e?"Edit Comment":"Add Comment",onSubmit:a,icon:e?J.Icon.Pencil:J.Icon.Plus})}),children:(0,Vt.jsx)(J.Form.TextArea,{id:"comment",title:"Comment",placeholder:"Leave a comment",value:c,onChange:n})})}var b=require("@raycast/api"),ss=require("date-fns"),rs=It(require("remove-markdown"));var os=require("@raycast/utils");function vi(e){let{data:t,error:i,isLoading:s,mutate:o}=(0,os.useCachedPromise)(To,[e]);return{comments:t,commentsError:i,isLoadingComments:s,mutateComments:o}}var G=require("react/jsx-runtime");function $i({issue:e}){let{linearClient:t}=k(),{me:i,isLoadingMe:s}=Ye(),{comments:o,isLoadingComments:c,mutateComments:n}=vi(e.id);async function a(r){if(await(0,b.confirmAlert)({title:"Delete Comment",message:"Are you sure you want to delete this comment?",icon:{source:b.Icon.Trash,tintColor:b.Color.Red}}))try{await(0,b.showToast)({style:b.Toast.Style.Animated,title:"Deleting comment"}),await n(t.deleteComment(r),{optimisticUpdate(l){return l&&l?.filter(d=>d.id!==r)}}),await(0,b.showToast)({style:b.Toast.Style.Success,title:"Deleted comment"})}catch(l){(0,b.showToast)({style:b.Toast.Style.Failure,title:"Failed to delete comment",message:U(l)})}}return(0,G.jsxs)(b.List,{isLoading:c||s,navigationTitle:`${e.identifier} \u2022 Comments`,searchBarPlaceholder:"Filter by user or comment content",isShowingDetail:!0,children:[(0,G.jsx)(b.List.EmptyView,{title:"No comments",description:"This issue doesn't have any comments.",actions:(0,G.jsx)(b.ActionPanel,{children:(0,G.jsx)(b.Action.Push,{title:"Add Comment",icon:b.Icon.Plus,target:(0,G.jsx)(at,{issue:e,mutateComments:n})})})}),o?.map(r=>{let l=new Date(r.createdAt);return(0,G.jsx)(b.List.Item,{title:r.user.displayName,subtitle:r.body,icon:_(r.user),keywords:(0,rs.default)(r.body).replace(/\n/g," ").split(" "),accessories:[{date:l,tooltip:`Created: ${(0,ss.format)(l,"EEEE d MMMM yyyy 'at' HH:mm")}`}],detail:(0,G.jsx)(b.List.Item.Detail,{markdown:r.body}),actions:(0,G.jsxs)(b.ActionPanel,{children:[(0,G.jsx)(pe,{title:"Open Comment",url:r.url}),i?.id===r.user.id?(0,G.jsxs)(b.ActionPanel.Section,{children:[(0,G.jsx)(b.Action.Push,{title:"Edit Comment",icon:b.Icon.Pencil,shortcut:b.Keyboard.Shortcut.Common.Edit,target:(0,G.jsx)(at,{issue:e,comment:r,mutateComments:n})}),(0,G.jsx)(b.Action,{title:"Delete Comment",icon:b.Icon.Trash,style:b.Action.Style.Destructive,shortcut:b.Keyboard.Shortcut.Common.Remove,onAction:()=>a(r.id)})]}):null,(0,G.jsx)(b.ActionPanel.Section,{children:(0,G.jsx)(b.Action.Push,{title:"Add Comment",icon:b.Icon.Plus,shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},target:(0,G.jsx)(at,{issue:e,mutateComments:n})})}),(0,G.jsxs)(b.ActionPanel.Section,{children:[(0,G.jsx)(b.Action.CopyToClipboard,{icon:b.Icon.Clipboard,content:r.url,title:"Copy Comment URL",shortcut:b.Keyboard.Shortcut.Common.CopyPath}),(0,G.jsx)(b.Action.CopyToClipboard,{icon:b.Icon.Clipboard,content:r.body,title:"Copy Comment",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,G.jsx)(b.ActionPanel.Section,{children:(0,G.jsx)(b.Action,{title:"Refresh",icon:b.Icon.ArrowClockwise,shortcut:b.Keyboard.Shortcut.Common.Refresh,onAction:n})})]})},r.id)})]})}var lt=require("@raycast/api");var je=require("@raycast/api"),oi=require("date-fns");var ct=require("react/jsx-runtime");function qt({issue:e,mutateList:t,mutateSubIssues:i,priorities:s,me:o}){let c=[e.identifier,e.state.name,e.priorityLabel];e.assignee&&c.push(e.assignee.email,e.assignee.displayName);let n=new Date(e.updatedAt),a=e.dueDate?new Date(e.dueDate):null,r=e.estimate?{icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},text:ei({estimate:e.estimate,issueEstimationType:e.team.issueEstimationType})}:null,l=e.cycle?tt(e.cycle):null,d=e.project||null,f=e.labels.nodes.length>0,D=[{date:n,tooltip:`Updated: ${(0,oi.format)(n,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:a?ht(a):void 0,text:a?(0,oi.format)(a,"MMM dd"):void 0,tooltip:a?`Due date: ${(0,oi.format)(a,"MM/dd/yyyy")}`:void 0},{icon:f?je.Icon.Tag:void 0,text:f?String(e.labels.nodes.length):void 0,tooltip:f?e.labels.nodes.map(C=>C.name).join(", "):void 0},{icon:d?K(d):void 0,tooltip:`Project: ${d?d.name:void 0}`},{icon:l?{source:l.icon}:void 0,text:l?String(l.number):void 0,tooltip:l?`Cycle: ${l.title}`:void 0},{icon:r?r.icon:void 0,text:r?r.text:void 0},{icon:ie(e.state),tooltip:`Status: ${e.state.name}`},{icon:_(e.assignee),tooltip:e.assignee?`Assignee: ${e.assignee?.displayName} (${e.assignee?.email})`:"Unassigned"}];return(0,ct.jsx)(je.List.Item,{title:e.title,icon:{value:{source:Le[e.priority]},tooltip:`Priority: ${e.priorityLabel}`},subtitle:e.identifier,keywords:c,accessories:D,actions:(0,ct.jsxs)(je.ActionPanel,{title:e.identifier,children:[(0,ct.jsx)(je.Action.Push,{title:"Show Details",icon:je.Icon.Sidebar,target:(0,ct.jsx)(Wt,{issue:e,mutateList:t,priorities:s,me:o})}),(0,ct.jsx)(wt,{issue:e,mutateList:t,mutateSubIssues:i,priorities:s,me:o})]})},e.id)}var ze=require("react/jsx-runtime");function Ri({issue:e,mutateList:t}){let{issues:i,isLoadingIssues:s,mutateList:o}=ge(l=>Ao(l),[e.id]),{priorities:c,isLoadingPriorities:n}=Ut(),{me:a,isLoadingMe:r}=Ye();return(0,ze.jsxs)(lt.List,{isLoading:s||r||n||r,navigationTitle:`${e.identifier} \u2022 Sub-issues`,children:[(0,ze.jsx)(lt.List.EmptyView,{title:"No issues",description:"This issue doesn't have any sub-issues.",actions:(0,ze.jsx)(lt.ActionPanel,{children:(0,ze.jsx)(lt.Action.Push,{title:"Create Sub-Issue",target:(0,ze.jsx)(Qt,{priorities:c,me:a,parentId:e.id,projectId:e.project?.id,cycleId:e.cycle?.id,teamId:e.team.id})})})}),i?.map(l=>(0,ze.jsx)(qt,{issue:l,mutateList:t,mutateSubIssues:o,priorities:c,me:a},l.id))]})}var O=require("@raycast/api");function as(e){let t=[`Work on Linear issue ${e.identifier}:`,""],i=fr(e.branchName);if(i&&t.push(`Suggested branch name: ${i}`,""),t.push(`<issue identifier="${si(e.identifier)}">`),t.push(`<title>${e.title}</title>`),t.push(...cs(e.description)),e.team?.name&&t.push(`<team name="${si(e.team.name)}"/>`),e.labels?.nodes?.forEach(o=>{t.push(`<label>${o.name}</label>`)}),e.project?.name){let o=si(e.project.name);t.push(e.project.description?`<project name="${o}">${e.project.description}</project>`:`<project name="${o}"/>`)}e.parent&&t.push(...ns("parent-issue",e.parent));let s=e.children?.nodes??[];return s.length>0&&(t.push("<sub-issues>"),s.forEach(o=>t.push(...ns("sub-issue",o))),t.push("</sub-issues>")),t.push("</issue>"),t.join(`
`)}function ns(e,t){return[`<${e} identifier="${si(t.identifier)}">`,`<id>${t.id}</id>`,`<title>${t.title}</title>`,...cs(t.description),`</${e}>`]}function cs(e){return e?e.includes(`
`)?["<description>",e,"</description>"]:[`<description>${e}</description>`]:[]}function fr(e){return e&&e.slice(e.lastIndexOf("/")+1)}function si(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}var ye=require("react/jsx-runtime"),Ir={ISSUE_TITLE:"title",ISSUE_ID:"identifier",ISSUE_URL:"url",ISSUE_BRANCH_NAME:"branchName"};function yr(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;")}function hr(e){return e.replace(/\[/g,"\\[").replace(/\]/g,"\\]")}function Pr(e){return{html:`<a href="${e.url}">${yr(e.title)}</a>`,text:`[${hr(e.title)}](${e.url})`}}function ji({issue:e}){let{issueCustomCopyAction:t}=(0,O.getPreferenceValues)();async function i(){let s=await(0,O.showToast)({style:O.Toast.Style.Animated,title:"Copying prompt"});try{await O.Clipboard.copy(as(await Lo(e.id))),s.style=O.Toast.Style.Success,s.title="Copied prompt to clipboard"}catch(o){s.style=O.Toast.Style.Failure,s.title="Failed copying prompt",s.message=U(o)}}return(0,ye.jsxs)(O.ActionPanel.Section,{children:[(0,ye.jsx)(O.Action.CopyToClipboard,{content:e.identifier,title:"Copy Issue ID",shortcut:{macOS:{modifiers:["cmd"],key:"."},Windows:{modifiers:["ctrl"],key:"."}}}),(0,ye.jsx)(O.Action.CopyToClipboard,{content:{html:`<a href="${e.url}" title="${e.title}">${e.identifier}: ${e.title}</a>`,text:e.url},title:"Copy Formatted Issue URL",shortcut:O.Keyboard.Shortcut.Common.CopyPath}),(0,ye.jsx)(O.Action.CopyToClipboard,{content:e.url,title:"Copy Issue URL",shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}}}),(0,ye.jsx)(O.Action.CopyToClipboard,{content:e.title,title:"Copy Issue Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}}),(0,ye.jsx)(O.Action.CopyToClipboard,{content:Pr(e),title:"Copy Title as Link",shortcut:{macOS:{modifiers:["cmd","shift"],key:"t"},Windows:{modifiers:["ctrl","shift"],key:"t"}}}),(0,ye.jsx)(O.Action.CopyToClipboard,{content:e.branchName,title:"Copy Git Branch Name",shortcut:O.Keyboard.Shortcut.Common.CopyName}),t&&t!==""?(0,ye.jsx)(O.Action.CopyToClipboard,{content:t?.replace(/\{(.*?)\}/g,(s,o)=>{let c=e[Ir[o]];return c||s}),title:"Custom Copy",shortcut:{macOS:{modifiers:["cmd","opt"],key:"."},Windows:{modifiers:["ctrl","alt"],key:"."}}}):null,(0,ye.jsx)(O.Action,{icon:O.Icon.Clipboard,title:"Copy as Prompt",onAction:i,shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"p"},Windows:{modifiers:["ctrl","alt","shift"],key:"p"}}})]})}var he=require("@raycast/api"),ls=require("react");var Pe=require("react/jsx-runtime");function xi({issue:e,updateIssue:t}){let{linearClient:i}=k(),[s,o]=(0,ls.useState)(!1),{cycles:c,isLoadingCycles:n}=it(e.team.id,{execute:s}),a=e.cycle?tt(e.cycle):null,r=a?.isActive||!1,l=a?.isNext||!1;async function d(C){let y=e.cycle;t({animatedTitle:"Moving to cycle",payload:{cycleId:C?.id||null},optimisticUpdate(P){return{...P,cycle:C||void 0}},rollbackUpdate(P){return{...P,cycle:y}},successTitle:C?"Moved to cycle":"Removed from cycle",successMessage:C?.title?C.title:"",errorTitle:"Failed to move to cycle"})}async function f(){let{nodes:C}=await i.cycles({filter:{team:{id:{eq:e.team.id}}}}),y=Ve(C||[]),P=y.findIndex(g=>g.isActive),v=(P>-1?y[P]:null)?y[P+1]:null;if(v)return d(v)}async function D(){let{nodes:C}=await i.cycles({filter:{team:{id:{eq:e.team.id}}}}),P=Ve(C||[]).find(oe=>oe.isActive);if(P)return d(P)}return(0,Pe.jsxs)(Pe.Fragment,{children:[(0,Pe.jsxs)(he.ActionPanel.Submenu,{title:"Move to Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:he.Keyboard.Shortcut.Common.Copy,onOpen:()=>o(!0),children:[(0,Pe.jsx)(he.Action,{title:"No Cycle",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}},onAction:()=>d(null)}),!c&&n?(0,Pe.jsx)(he.Action,{title:"Loading\u2026"}):Ve(c||[]).map(C=>(0,Pe.jsx)(he.Action,{autoFocus:C.id===a?.id,title:C.title,icon:{source:C.icon},onAction:()=>d(C)},C.id))]}),r?null:(0,Pe.jsx)(he.Action,{title:"Move to Active Cycle",icon:{source:{light:"light/active-cycle.svg",dark:"dark/active-cycle.svg"}},shortcut:he.Keyboard.Shortcut.Common.Copy,onAction:()=>D()}),l?null:(0,Pe.jsx)(he.Action,{title:"Move to Next Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"n"},Windows:{modifiers:["ctrl","shift"],key:"n"}},onAction:()=>f()})]})}var ke=require("@raycast/api"),ds=require("lodash"),us=require("react");var xe=require("react/jsx-runtime");function Mi({issue:e,updateIssue:t}){let[i,s]=(0,us.useState)(!1),{labels:o}=ot(e.team.id,{execute:i}),[,c]=(0,ds.partition)(o||[],r=>e.labels.nodes.map(l=>l.id).includes(r.id));async function n(r){let l=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Adding label",payload:{labelIds:[...l,r.id]},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,r]}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(f=>f.id!==r.id)}}},successTitle:"Added label",successMessage:`Label "${r.name}" added to ${e.identifier}`,errorTitle:"Failed to add label"})}async function a(r){let l=e.labels.nodes.map(d=>d.id);t({animatedTitle:"Remove label",payload:{labelIds:l.filter(d=>d!==r.id)},optimisticUpdate(d){return{...d,labels:{...d.labels,nodes:d.labels.nodes.filter(f=>f.id!==r.id)}}},rollbackUpdate(d){return{...d,labels:{...d.labels,nodes:[...d.labels.nodes,r]}}},successTitle:"Removed label",successMessage:`Label "${r.name}" removed from ${e.identifier}`,errorTitle:"Failed to remove label"})}return(0,xe.jsxs)(xe.Fragment,{children:[(0,xe.jsx)(ke.ActionPanel.Submenu,{title:"Add Label",icon:ke.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},onOpen:()=>s(!0),children:c.map(r=>(0,xe.jsx)(ke.Action,{title:r.name,icon:{source:ke.Icon.Dot,tintColor:r.color},onAction:()=>n(r)},r.id))}),e.labels.nodes.length>0?(0,xe.jsx)(ke.ActionPanel.Submenu,{title:"Remove Label",icon:ke.Icon.Tag,shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}},children:e.labels.nodes.map(r=>(0,xe.jsx)(ke.Action,{title:r.name,icon:{source:ke.Icon.Dot,tintColor:r.color},onAction:()=>a(r)},r.id))}):null]})}var Ge=require("@raycast/api"),ms=require("react");var bt=require("react/jsx-runtime");function Ui({issue:e,updateIssue:t}){let[i,s]=(0,ms.useState)(!1),{milestones:o,isLoadingMilestones:c}=$e(e.project?.id,{execute:i});async function n(a){let r=e.projectMilestone;t({animatedTitle:"Setting milestone",payload:{projectMilestoneId:a?a.id:null},optimisticUpdate(l){return{...l,milestone:a||void 0}},rollbackUpdate(l){return{...l,milestone:r}},successTitle:a?"Set milestone":`Removed milestone from ${e.identifier}`,successMessage:a?`"${a.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set milestone"})}return(0,bt.jsxs)(Ge.ActionPanel.Submenu,{title:"Set Milestone",icon:{source:"linear-icons/milestone.svg",tintColor:Ge.Color.PrimaryText},shortcut:{modifiers:["ctrl","shift"],key:"m"},onOpen:()=>s(!0),children:[(0,bt.jsx)(Ge.Action,{title:"No Milestone",icon:{source:"linear-icons/no-milestone.svg"},onAction:()=>n(null)}),!o&&c?(0,bt.jsx)(Ge.Action,{title:"Loading\u2026"}):(o||[]).map(a=>(0,bt.jsx)(Ge.Action,{autoFocus:a.id===e.projectMilestone?.id,title:`${a.name}  (${a.targetDate||"No Target Date"})`,icon:De(a),onAction:()=>n(a)},a.id))]})}var Dt=require("@raycast/api"),ps=require("react");var Me=require("react/jsx-runtime");function Fi({issue:e,updateIssue:t}){let[i,s]=(0,ps.useState)(!1),{issues:o,isLoadingIssues:c}=ge(St,[],{execute:i}),n=e.parent,a=n?.id,r=!!a;async function l(d){t({animatedTitle:"Setting parent issue",payload:{parentId:d?d.id:null},optimisticUpdate(f){return{...f,parent:d||void 0}},rollbackUpdate(f){return{...f,parent:n}},successTitle:"Set parent issue",successMessage:d?`${d.identifier} set as parent issue`:`Removed parent issue from ${e.identifier}`,errorTitle:"Failed to set parent issue"})}return(0,Me.jsxs)(Me.Fragment,{children:[(0,Me.jsx)(Dt.ActionPanel.Submenu,{title:r?"Change Parent Issue":"Set Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"i"},onOpen:()=>s(!0),children:!o&&c?(0,Me.jsx)(Dt.Action,{title:"Loading\u2026"}):(o||[]).map(d=>(0,Me.jsx)(Dt.Action,{autoFocus:d.id===a,title:`${d.identifier} - ${d.title}`,icon:ie(d.state),onAction:()=>l(d)},d.id))}),r?(0,Me.jsx)(Dt.Action,{title:"Remove Parent Issue",icon:{source:{light:"light/parent-issue.svg",dark:"dark/parent-issue.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"k"},Windows:{modifiers:["ctrl","shift"],key:"k"}},onAction:()=>l(null)}):null]})}var At=require("@raycast/api"),gs=require("react");var Lt=require("react/jsx-runtime");function Ei({issue:e,updateIssue:t}){let[i,s]=(0,gs.useState)(!1),{projects:o,isLoadingProjects:c}=ne(e.team.id,{execute:i});async function n(a){let r=e.project;t({animatedTitle:"Setting project",payload:{projectId:a?a.id:null},optimisticUpdate(l){return{...l,project:a||void 0}},rollbackUpdate(l){return{...l,project:r}},successTitle:a?"Set project":`Removed project from ${e.identifier}`,successMessage:a?`"${a.name}" added to ${e.identifier}`:"",errorTitle:"Failed to set project"})}return(0,Lt.jsxs)(At.ActionPanel.Submenu,{title:"Set Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},shortcut:{modifiers:["ctrl","shift"],key:"p"},onOpen:()=>s(!0),children:[(0,Lt.jsx)(At.Action,{title:"No Project",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}},onAction:()=>n(null)}),!o&&c?(0,Lt.jsx)(At.Action,{title:"Loading\u2026"}):(o||[]).map(a=>(0,Lt.jsx)(At.Action,{autoFocus:a.id===e.project?.id,title:`${a.name} (${a.status.name})`,icon:K(a),onAction:()=>n(a)},a.id))]})}var dt=require("@raycast/api"),fs=require("react");var ri=require("react/jsx-runtime");function Oi({issue:e,updateIssue:t}){let[i,s]=(0,fs.useState)(!1),{states:o,isLoadingStates:c}=Re(e.team.id,{execute:i}),n=We(o||[]);async function a(r){let l=e.state;t({animatedTitle:"Setting status",payload:{stateId:r.id},optimisticUpdate(d){return{...d,state:r}},rollbackUpdate(d){return{...d,state:l}},successTitle:"Set status",successMessage:`${e.identifier} set to ${r.name}`,errorTitle:"Failed to set status"})}return(0,ri.jsx)(dt.ActionPanel.Submenu,{icon:dt.Icon.Circle,title:"Set Status",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},onOpen:()=>s(!0),children:n.length===0&&c?(0,ri.jsx)(dt.Action,{title:"Loading\u2026"}):n.map(r=>(0,ri.jsx)(dt.Action,{autoFocus:r.id===e.state.id,title:r.name,icon:ie(r),onAction:()=>a(r)},r.id))})}var T=require("react/jsx-runtime");function wt({issue:e,mutateList:t,mutateSubIssues:i,mutateDetail:s,showAttachmentsAction:o,attachments:c,priorities:n,me:a}){let{pop:r}=(0,I.useNavigation)(),{linearClient:l}=k(),d=e.assignee?.id===a?.id,f=Ct({issueEstimationType:e.team.issueEstimationType,issueEstimationAllowZero:e.team.issueEstimationAllowZero,issueEstimationExtended:e.team.issueEstimationExtended});async function D({animatedTitle:S,payload:j,optimisticUpdate:F,rollbackUpdate:ee,successTitle:Ze,successMessage:Ke,errorTitle:gt}){try{await(0,I.showToast)({style:I.Toast.Style.Animated,title:S});let me=l.updateIssue(e.id,j);await Promise.all([me,t?t(me,{optimisticUpdate(Q){if(Q)return Q.map(B=>B.id===e.id?F(B):B)},rollbackOnError(Q){if(Q)return Q.map(B=>B.id===e.id?ee(B):B)}}):Promise.resolve(),i?i(me,{optimisticUpdate(Q){if(Q)return Q.map(B=>B.id===e.id?F(B):B)},rollbackOnError(Q){if(Q)return Q.map(B=>B.id===e.id?ee(B):B)}}):Promise.resolve(),s?s(me,{optimisticUpdate(Q){return F(Q)},rollbackOnError(Q){return ee(Q)}}):Promise.resolve()]),await(0,I.showToast)({style:I.Toast.Style.Success,title:Ze,message:Ke})}catch(me){await(0,I.showToast)({style:I.Toast.Style.Failure,title:gt,message:U(me)})}}async function C(){if(await(0,I.confirmAlert)({title:"Delete Issue",message:"Are you sure you want to delete the selected issue?",icon:{source:I.Icon.Trash,tintColor:I.Color.Red}}))try{await(0,I.showToast)({style:I.Toast.Style.Animated,title:"Deleting issue"});let S=l.deleteIssue(e.id);s&&r(),await Promise.all([S,t?t(S,{optimisticUpdate(j){if(j)return j.filter(F=>F.id!==e.id)}}):Promise.resolve(),i?i(S,{optimisticUpdate(j){if(j)return j.filter(F=>F.id!==e.id)}}):Promise.resolve()]),await(0,I.showToast)({style:I.Toast.Style.Success,title:"Issue deleted",message:`"${e.title}" is deleted`})}catch(S){await(0,I.showToast)({style:I.Toast.Style.Failure,title:"Failed to delete issue",message:U(S)})}}async function y(S){let j=e.priority;D({animatedTitle:"Setting priority",payload:{priority:S.priority},optimisticUpdate(F){return{...F,priority:S.priority}},rollbackUpdate(F){return{...F,priority:j}},successTitle:"Set priority",successMessage:`${e.identifier} priority set to ${S.label}`,errorTitle:"Failed to set priority"})}async function P(S){let j=e.assignee;D({animatedTitle:"Setting assignee",payload:{assigneeId:S.id},optimisticUpdate(F){return{...F,assignee:S}},rollbackUpdate(F){return{...F,assignee:j}},successTitle:"Set assignee",successMessage:`${e.identifier} assigned to ${S.displayName}`,errorTitle:"Failed to set assignee"})}async function oe(S){let j=e.assignee;D({animatedTitle:"Setting assignee",payload:{assigneeId:S?S.id:null},optimisticUpdate(F){return{...F,assignee:S||void 0}},rollbackUpdate(F){return{...F,assignee:j}},successTitle:"Set assignee",successMessage:`${e.identifier} ${S?"assigned to":"un-assigned from"} me`,errorTitle:"Failed to set assignee"})}async function v({estimate:S,label:j}){let F=e.estimate;D({animatedTitle:"Setting estimate",payload:{estimate:S},optimisticUpdate(ee){return{...ee,estimate:S}},rollbackUpdate(ee){return{...ee,estimate:F}},successTitle:"Set estimate",successMessage:`${e.identifier} estimate set to ${j}`,errorTitle:"Failed to set estimate"})}async function g(S){D({animatedTitle:S?"Setting due date":"Removing due date",payload:{dueDate:S},optimisticUpdate(j){return{...j,dueDate:S}},rollbackUpdate(j){return{...j,dueDate:j.dueDate}},successTitle:S?"Set due date":"Removed due date",successMessage:S?`${e.identifier} due date set to ${(0,Ni.format)(S,"MM/dd/yyyy")}`:"",errorTitle:"Failed to set due date"})}async function M(S){if(!S){await(0,I.showToast)({style:I.Toast.Style.Failure,title:"Failed setting reminder"});return}try{await(0,I.showToast)({style:I.Toast.Style.Animated,title:"Setting reminder"}),await l.issueReminder(e.id,S),s&&r(),await(0,I.showToast)({style:I.Toast.Style.Success,title:"Reminder set",message:`${e.identifier} reminder set to ${(0,Ni.format)(S,"MM/dd/yyyy")}`})}catch(j){await(0,I.showToast)({style:I.Toast.Style.Failure,title:"Failed to set reminder",message:U(j)})}}function N(){t&&t(),i&&i(),s&&s()}let[Te,He]=(0,Is.useState)(""),{users:se,supportsUserTypeahead:we,isLoadingUsers:Fe}=be(Te);return(0,T.jsxs)(T.Fragment,{children:[(0,T.jsx)(pe,{title:"Open Issue",url:e.url}),(0,T.jsxs)(I.ActionPanel.Section,{children:[(0,T.jsx)(I.Action.Push,{title:"Edit Issue",icon:I.Icon.Pencil,shortcut:I.Keyboard.Shortcut.Common.Edit,target:(0,T.jsx)(Li,{priorities:n,me:a,issue:e,mutateList:t,mutateSubIssues:i})}),(0,T.jsx)(Oi,{issue:e,updateIssue:D}),n&&n.length>0?(0,T.jsx)(I.ActionPanel.Submenu,{icon:I.Icon.LevelMeter,title:"Set Priority",shortcut:{macOS:{modifiers:["cmd","opt"],key:"p"},Windows:{modifiers:["ctrl","alt"],key:"p"}},children:n.map(S=>(0,T.jsx)(I.Action,{autoFocus:S.priority===e.priority,title:S.label,icon:{source:Le[S.priority]},onAction:()=>y(S)},S.priority))}):null,(0,T.jsx)(I.ActionPanel.Submenu,{icon:I.Icon.AddPerson,title:"Assign to",shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}},...we&&{onSearchTextChange:He,isLoading:Fe,throttle:!0},children:se?.map(S=>(0,T.jsx)(I.Action,{autoFocus:S.id===e.assignee?.id,title:`${S.displayName} (${S.email})`,icon:_(S),onAction:()=>P(S)},S.id))}),a?(0,T.jsx)(I.Action,{title:d?"Un-Assign from Me":"Assign to Me",icon:_(a),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}},onAction:()=>oe(d?null:a)}):null,f?(0,T.jsx)(I.ActionPanel.Submenu,{title:"Set Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}},children:f.map(({estimate:S,label:j})=>(0,T.jsx)(I.Action,{autoFocus:S===e.estimate,title:j,onAction:()=>v({estimate:S,label:j})},S))}):null,(0,T.jsx)(I.Action.PickDate,{title:"Set Due Date",shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}},onChange:g}),(0,T.jsx)(I.Action.PickDate,{title:"Set Reminder",shortcut:{macOS:{modifiers:["cmd","shift"],key:"h"},Windows:{modifiers:["ctrl","shift"],key:"h"}},onChange:M}),(0,T.jsx)(Mi,{issue:e,updateIssue:D}),(0,T.jsx)(xi,{issue:e,updateIssue:D}),(0,T.jsx)(Ei,{issue:e,updateIssue:D}),(0,T.jsx)(Ui,{issue:e,updateIssue:D}),(0,T.jsx)(Fi,{issue:e,updateIssue:D}),(0,T.jsx)(I.Action,{title:"Delete Issue",shortcut:I.Keyboard.Shortcut.Common.Remove,icon:I.Icon.Trash,style:I.Action.Style.Destructive,onAction:()=>C()})]}),(0,T.jsxs)(I.ActionPanel.Section,{children:[(0,T.jsx)(I.Action.Push,{title:"Show Sub-Issues",icon:I.Icon.List,target:(0,T.jsx)(Ri,{issue:e,mutateList:t}),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}),(0,T.jsx)(I.Action.Push,{title:"Break Issues into Sub-Issues",icon:I.Icon.Stars,target:(0,T.jsx)(Ai,{issue:e}),shortcut:{macOS:{modifiers:["opt","shift"],key:"m"},Windows:{modifiers:["alt","shift"],key:"m"}}}),o?(0,T.jsx)(I.Action.Push,{title:"Show Issue Links",icon:I.Icon.Link,target:(0,T.jsx)(Ti,{attachments:c??[],issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}}):null,(0,T.jsx)(I.Action.Push,{title:"Add Attachments and Links",icon:I.Icon.NewDocument,target:(0,T.jsx)(ii,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,T.jsx)(I.Action.Push,{title:"Add Comment",icon:I.Icon.Plus,target:(0,T.jsx)(at,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"n"},Windows:{modifiers:["ctrl","alt","shift"],key:"n"}}}),(0,T.jsx)(I.Action.Push,{title:"Show Comments",icon:I.Icon.Bubble,target:(0,T.jsx)($i,{issue:e}),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"c"},Windows:{modifiers:["ctrl","alt","shift"],key:"c"}}})]}),(0,T.jsx)(ji,{issue:e}),(0,T.jsx)(I.ActionPanel.Section,{children:(0,T.jsx)(I.Action,{title:"Refresh",icon:I.Icon.ArrowClockwise,shortcut:I.Keyboard.Shortcut.Common.Refresh,onAction:()=>N()})})]})}var W=require("react/jsx-runtime");function Wt({issue:e,mutateList:t,priorities:i,me:s}){let{issue:o,isLoadingIssue:c,mutateDetail:n}=st(e),a=`# ${o?.title}`;o?.description&&(a+=`

${o.description}`);let r=o?.cycle?tt(o.cycle):null,l=o.relations?o.relations.nodes.filter(D=>D.type=="related"):null,d=o.relations?o.relations.nodes.filter(D=>D.type=="duplicate"):null,f=o.attachments?.nodes.length??0;return(0,W.jsx)(V.Detail,{markdown:a,isLoading:c,...o?{metadata:(0,W.jsxs)(V.Detail.Metadata,{children:[(0,W.jsx)(V.Detail.Metadata.Label,{title:"Status",text:o.state.name,icon:ie(o.state)}),(0,W.jsx)(V.Detail.Metadata.Label,{title:"Priority",text:o.priorityLabel,icon:{source:Le[o.priority]}}),(0,W.jsx)(V.Detail.Metadata.Label,{title:"Assignee",text:o.assignee?o.assignee.displayName:"Unassigned",icon:_(o.assignee)}),o.team.issueEstimationType!=="notUsed"?(0,W.jsx)(V.Detail.Metadata.Label,{title:"Estimate",text:ei({estimate:o.estimate,issueEstimationType:o.team.issueEstimationType}),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}):null,o.labels.nodes.length>0?(0,W.jsx)(V.Detail.Metadata.TagList,{title:"Labels",children:o.labels.nodes.map(({id:D,name:C,color:y})=>(0,W.jsx)(V.Detail.Metadata.TagList.Item,{text:C,color:y},D))}):(0,W.jsx)(V.Detail.Metadata.Label,{title:"Labels",text:"No Labels"}),o.dueDate?(0,W.jsx)(V.Detail.Metadata.Label,{title:"Due Date",text:(0,ys.format)(new Date(o.dueDate),"MM/dd/yyyy"),icon:ht(new Date(o.dueDate))}):null,f>0?(0,W.jsx)(V.Detail.Metadata.Label,{title:"Links",text:`${f>1?`${f} links`:"1 link"}`,icon:V.Icon.Link}):null,(0,W.jsx)(V.Detail.Metadata.Separator,{}),(0,W.jsx)(V.Detail.Metadata.Label,{title:"Cycle",text:r?r.title:"No Cycle",icon:{source:r?r.icon:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),(0,W.jsx)(V.Detail.Metadata.Label,{title:"Project",text:o.project?o.project.name:"No Project",icon:K(o.project)}),(0,W.jsx)(V.Detail.Metadata.Label,{title:"Milestone",text:o.projectMilestone?o.projectMilestone.name:"No Milestone",icon:De(o.projectMilestone)}),(0,W.jsx)(V.Detail.Metadata.Label,{title:"Parent Issue",text:o.parent?o.parent.title:"No Issue",icon:o.parent?ie(o.parent.state):{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),l&&l.length>0?(0,W.jsx)(V.Detail.Metadata.TagList,{title:"Related",children:l.map(({id:D,relatedIssue:C})=>(0,W.jsx)(V.Detail.Metadata.TagList.Item,{text:C.identifier},D))}):null,d&&d.length>0?(0,W.jsx)(V.Detail.Metadata.TagList,{title:"Duplicates",children:d.map(({id:D,relatedIssue:C})=>(0,W.jsx)(V.Detail.Metadata.TagList.Item,{text:C.identifier},D))}):null]}),actions:(0,W.jsx)(V.ActionPanel,{children:(0,W.jsx)(wt,{issue:o,mutateList:t,mutateDetail:n,priorities:i,showAttachmentsAction:f>0,attachments:o.attachments?.nodes??[],me:s})})}:{}})}var h=require("react/jsx-runtime");function kr(e,t){return e==="url"?{title:"Copy Issue URL",onAction:()=>u.Clipboard.copy(t.url)}:e==="id-as-link"?{title:"Copy Issue ID as Link",onAction:()=>u.Clipboard.copy({text:`[${t.identifier}](${t.url})`,html:`<a href="${t.url}">${t.identifier}</a>`})}:e==="title"?{title:"Copy Issue Title",onAction:()=>u.Clipboard.copy(t.title)}:e==="title-as-link"?{title:"Copy Issue Title as Link",onAction:()=>u.Clipboard.copy({text:`[${t.title}](${t.url})`,html:`<a href="${t.url}">${t.title}</a>`})}:{title:"Copy Issue ID",onAction:()=>u.Clipboard.copy(t.identifier)}}function Qt(e){let{push:t}=(0,u.useNavigation)(),{autofocusField:i,copyToastAction:s}=(0,u.getPreferenceValues)(),[o,c]=(0,_e.useState)(""),{teams:n,org:a,supportsTeamTypeahead:r,isLoadingTeams:l}=et(o),d=n&&n.length>1,[f,D]=(0,_e.useState)(""),{users:C,supportsUserTypeahead:y,isLoadingUsers:P}=be(f),{handleSubmit:oe,itemProps:v,values:g,setValue:M,focus:N,reset:Te,setValidationError:He}=(0,ut.useForm)({async onSubmit(m){let E=await(0,u.showToast)({style:u.Toast.Style.Animated,title:"Creating issue"}),Ee=d?m.teamId:n?.[0]?.id;if(!Ee)return He("teamId","The team is required."),!1;try{let te={teamId:Ee,title:m.title,description:m.description||"",stateId:m.stateId,labelIds:m.labelIds,dueDate:m.dueDate,...B&&m.estimate?{estimate:parseInt(m.estimate)}:{},...m.assigneeId?{assigneeId:m.assigneeId}:{},...m.cycleId?{cycleId:m.cycleId}:{},...m.projectId?{projectId:m.projectId}:{},...m.milestoneId?{projectMilestoneId:m.milestoneId}:{},...m.parentId?{parentId:m.parentId}:{},priority:parseInt(m.priority)},{success:mi,issue:ft}=await Mo(te);if(mi&&ft){E.style=u.Toast.Style.Success,E.title=`Created Issue \u2022 ${ft?.identifier}`,E.primaryAction={title:"Open Issue",shortcut:u.Keyboard.Shortcut.Common.OpenWith,onAction:async()=>{t((0,h.jsx)(Wt,{issue:ft,priorities:e.priorities,me:e.me})),await E.hide()}},E.secondaryAction={shortcut:u.Keyboard.Shortcut.Common.Copy,...kr(s,ft)},Te({templateId:"",title:"",description:"",estimate:"",labelIds:[],dueDate:null,parentId:"",attachments:[],links:""}),N(d&&i?i:"title");let pi=ti(m.links);if(pi.length>0){let Xe=pi.length===1?"link":"links";try{E.message=`Attaching ${Xe}\u2026`,await Promise.all(pi.map(Je=>Yt({issueId:ft.id,url:Je}))),E.message=`Successfully attached ${Xe}`}catch(Je){E.style=u.Toast.Style.Failure,E.title=`Failed attaching ${Xe}`,E.message=U(Je)}}if(m.attachments.length>0){let Xe=m.attachments.length===1?"attachment":"attachments";try{E.message=`Uploading ${Xe}\u2026`,await Promise.all(m.attachments.map(Je=>Jt({issueId:ft.id,url:Je}))),E.message=`Successfully uploaded ${Xe}`}catch(Je){E.style=u.Toast.Style.Failure,E.title=`Failed uploading ${Xe}`,E.message=U(Je)}}}}catch(te){E.style=u.Toast.Style.Failure,E.title="Failed to create issue",E.message=U(te)}M("teamId",Ee)},validation:{teamId:d?ut.FormValidation.Required:void 0,title:ut.FormValidation.Required,stateId:ut.FormValidation.Required,priority:ut.FormValidation.Required},initialValues:{templateId:e.draftValues?.templateId||"",teamId:e.draftValues?.teamId||e.teamId,title:e.draftValues?.title,description:e.draftValues?.description,priority:e.draftValues?.priority,stateId:e.draftValues?.stateId,estimate:e.draftValues?.estimate,assigneeId:e.draftValues?.assigneeId||e.assigneeId,labelIds:e.draftValues?.labelIds||[],dueDate:e.draftValues?.dueDate,cycleId:e.draftValues?.cycleId||e.cycleId,projectId:e.draftValues?.projectId||e.projectId,milestoneId:e.draftValues?.milestoneId||e.milestoneId,parentId:e.draftValues?.parentId||e.parentId,links:e.draftValues?.links||""}}),se=!!g.teamId&&g.teamId.trim().length>0,{issueTemplates:we,isLoadingIssueTemplates:Fe}=Di(g.teamId,{execute:se}),{states:S}=Re(g.teamId,{execute:se}),{labels:j}=ot(g.teamId,{execute:se}),{cycles:F}=it(g.teamId,{execute:se}),{issues:ee}=ge(St,[],{execute:se}),{projects:Ze}=ne(g.teamId,{execute:se}),{milestones:Ke}=$e(g.projectId,{execute:!!g.projectId});(0,_e.useEffect)(()=>{n?.length===1&&M("teamId",n[0].id)},[n]);let gt=(0,_e.useRef)(!1);(0,_e.useEffect)(()=>{if(!gt.current){gt.current=!0;return}me("")},[g.teamId]);function me(m){M("templateId",m);let E=we?.find(mi=>mi.id===m),Ee={assigneeId:e.assigneeId||"",cycleId:e.cycleId||"",projectId:e.projectId||"",milestoneId:e.milestoneId||""},te=E?Vo(E,Ee):bi(Ee);M("title",te.title),M("description",te.description),M("stateId",te.stateId),M("priority",te.priority),M("assigneeId",te.assigneeId),M("labelIds",te.labelIds),M("estimate",te.estimate),M("dueDate",te.dueDate),M("cycleId",te.cycleId),M("projectId",te.projectId),M("milestoneId",te.milestoneId??"")}let Q=n?.find(m=>m.id===g.teamId),B=Q?Ct({issueEstimationType:Q.issueEstimationType,issueEstimationAllowZero:Q.issueEstimationAllowZero,issueEstimationExtended:Q.issueEstimationExtended}):null,di=We(S||[]),Gt=S&&S.length>0,p=e.priorities&&e.priorities.length>0,re=j&&j.length>0,ve=F&&F.length>0,xt=Ze&&Ze.length>0,Xi=Ke&&Ke.length>0,ui=ee&&ee.length>0,Vs=we&&we.length>0;return(0,h.jsxs)(u.Form,{enableDrafts:e.enableDrafts,actions:(0,h.jsxs)(u.ActionPanel,{children:[(0,h.jsx)(u.Action.SubmitForm,{icon:u.Icon.Plus,onSubmit:oe,title:"Create Issue"}),(0,h.jsxs)(u.ActionPanel.Section,{children:[(0,h.jsx)(u.Action,{title:"Focus Title",icon:u.Icon.TextInput,onAction:()=>N("title"),shortcut:u.Keyboard.Shortcut.Common.Edit}),(0,h.jsx)(u.Action,{title:"Focus Description",icon:u.Icon.TextInput,onAction:()=>N("description"),shortcut:{modifiers:["ctrl"],key:"e"}}),(0,h.jsx)(u.Action,{title:"Focus Status",icon:u.Icon.Circle,onAction:()=>N("stateId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}}}),(0,h.jsx)(u.Action,{title:"Focus Priority",icon:u.Icon.LevelMeter,onAction:()=>N("priority"),shortcut:u.Keyboard.Shortcut.Common.Pin}),(0,h.jsx)(u.Action,{title:"Focus Assignee",icon:u.Icon.AddPerson,onAction:()=>N("assigneeId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"a"},Windows:{modifiers:["ctrl","shift"],key:"a"}}}),B?(0,h.jsx)(u.Action,{title:"Focus Estimate",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}},onAction:()=>N("estimate"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"e"},Windows:{modifiers:["ctrl","shift"],key:"e"}}}):null,(0,h.jsx)(u.Action,{title:"Focus Due Date",icon:u.Icon.Calendar,onAction:()=>N("dueDate"),shortcut:{macOS:{modifiers:["opt","shift"],key:"d"},Windows:{modifiers:["alt","shift"],key:"d"}}}),(0,h.jsx)(u.Action,{title:"Focus Labels",icon:u.Icon.Tag,onAction:()=>N("labelIds"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"l"},Windows:{modifiers:["ctrl","shift"],key:"l"}}}),ve?(0,h.jsx)(u.Action,{title:"Focus Cycle",icon:{source:{light:"light/cycle.svg",dark:"dark/cycle.svg"}},onAction:()=>N("cycleId"),shortcut:u.Keyboard.Shortcut.Common.Copy}):null,xt?(0,h.jsx)(u.Action,{title:"Focus Project",icon:{source:{light:"light/project.svg",dark:"dark/project.svg"}},onAction:()=>N("projectId"),shortcut:{modifiers:["ctrl","shift"],key:"p"}}):null,Xi?(0,h.jsx)(u.Action,{title:"Focus Milestone",icon:{source:{light:"light/milestone.svg",dark:"dark/milestone.svg"}},onAction:()=>N("milestoneId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}}}):null,ui?(0,h.jsx)(u.Action,{title:"Focus Parent Issue",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}},onAction:()=>N("parentId"),shortcut:{macOS:{modifiers:["cmd","shift"],key:"i"},Windows:{modifiers:["ctrl","shift"],key:"i"}}}):null,(0,h.jsx)(u.Action,{title:"Focus Attachments",icon:u.Icon.NewDocument,onAction:()=>N("attachments"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"a"},Windows:{modifiers:["ctrl","alt","shift"],key:"a"}}}),(0,h.jsx)(u.Action,{title:"Focus Links",icon:u.Icon.Link,onAction:()=>N("links"),shortcut:{macOS:{modifiers:["cmd","opt","shift"],key:"l"},Windows:{modifiers:["ctrl","alt","shift"],key:"l"}}})]})]}),isLoading:l||P||e.isLoading,children:[(r||d)&&(0,h.jsxs)(h.Fragment,{children:[(0,h.jsx)(u.Form.Dropdown,{title:"Team",storeValue:!0,...v.teamId,...r&&{onSearchTextChange:c,isLoading:l,throttle:!0},children:n?.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:m.name,value:m.id,icon:Pt(m,a)},m.id))}),(0,h.jsx)(u.Form.Separator,{})]}),se&&(Fe||Vs)?(0,h.jsxs)(h.Fragment,{children:[(0,h.jsxs)(u.Form.Dropdown,{id:"templateId",title:"Template",value:g.templateId||"",onChange:me,isLoading:Fe,children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"No Template",value:"",icon:u.Icon.Document}),we?.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:m.name,value:m.id,icon:u.Icon.Document},m.id))]}),(0,h.jsx)(u.Form.Separator,{})]}):null,(0,h.jsx)(u.Form.TextField,{title:"Title",placeholder:"Issue title",...i==="title"?{autoFocus:!0}:{},...v.title}),(0,h.jsx)(u.Form.TextArea,{title:"Description",placeholder:"Add some details (supports Markdown, e.g. **bold**)",enableMarkdown:!0,...v.description}),(0,h.jsx)(u.Form.Dropdown,{title:"Status",storeValue:!0,...v.stateId,children:Gt?di.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:m.name,value:m.id,icon:ie(m)},m.id)):null}),(0,h.jsx)(u.Form.Dropdown,{title:"Priority",storeValue:!0,...v.priority,children:p?e.priorities?.map(({priority:m,label:E})=>(0,h.jsx)(u.Form.Dropdown.Item,{title:E,value:String(m),icon:{source:Le[m]}},m)):null}),(0,h.jsxs)(u.Form.Dropdown,{title:"Assignee",storeValue:!0,...v.assigneeId,...y&&{onSearchTextChange:D,isLoading:P,throttle:!0},children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"Unassigned",value:"",icon:u.Icon.Person}),C?.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:m.name,value:m.id,icon:_(m)},m.id))]}),(0,h.jsx)(u.Form.TagPicker,{title:"Labels",placeholder:"Add label",...v.labelIds,children:re?j.map(({id:m,name:E,color:Ee})=>(0,h.jsx)(u.Form.TagPicker.Item,{title:E,value:m,icon:{source:u.Icon.Dot,tintColor:Ee}},m)):null}),B?(0,h.jsxs)(u.Form.Dropdown,{title:"Estimate",...v.estimate,children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"No estimate",value:"",icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}}),B.map(({estimate:m,label:E})=>(0,h.jsx)(u.Form.Dropdown.Item,{title:E,value:String(m),icon:{source:{light:"light/estimate.svg",dark:"dark/estimate.svg"}}},m))]}):null,(0,h.jsx)(u.Form.DatePicker,{title:"Due Date",type:u.Form.DatePicker.Type.Date,...v.dueDate}),ve||xt||ui?(0,h.jsx)(u.Form.Separator,{}):null,ve?(0,h.jsxs)(u.Form.Dropdown,{title:"Cycle",storeValue:!0,...v.cycleId,children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"No Cycle",value:"",icon:{source:{light:"light/no-cycle.svg",dark:"dark/no-cycle.svg"}}}),Ve(F).map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:m.title,value:m.id,icon:{source:m.icon}},m.id))]}):null,xt?(0,h.jsxs)(u.Form.Dropdown,{title:"Project",storeValue:!0,...v.projectId,children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"No Project",value:"",icon:{source:{light:"light/no-project.svg",dark:"dark/no-project.svg"}}}),Ze.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:`${m.name} (${m.status.name})`,value:m.id,icon:K(m)},m.id))]}):null,Xi?(0,h.jsxs)(u.Form.Dropdown,{title:"Milestone",storeValue:!0,...v.milestoneId,children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"No Milestone",value:"",icon:{source:"linear-icons/no-milestone.svg"}}),Ke.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:`${m.name} (${m.targetDate||"No Target Date"})`,value:m.id,icon:De(m)},m.id))]}):null,ui?(0,h.jsxs)(u.Form.Dropdown,{title:"Parent",...v.parentId,children:[(0,h.jsx)(u.Form.Dropdown.Item,{title:"No Issue",value:"",icon:{source:{light:"light/backlog.svg",dark:"dark/backlog.svg"}}}),ee.map(m=>(0,h.jsx)(u.Form.Dropdown.Item,{title:`${m.identifier} - ${m.title}`,value:m.id,icon:ie(m.state)},m.id))]}):null,(0,h.jsx)(u.Form.Separator,{}),(0,h.jsx)(u.Form.FilePicker,{title:"Attachment",...v.attachments}),(0,h.jsx)(u.Form.TextArea,{title:"Links",placeholder:`https://a.com
https://b.com
New link(s) on separate line(s)`,...v.links})]})}var hs=require("@raycast/api"),ni=require("lodash");var Tt=require("react/jsx-runtime");function Vi({mutateList:e,issues:t,priorities:i,me:s}){if(!t||t&&t.length===0)return null;let o=(0,ni.uniqBy)(t.map(a=>a.state),a=>a.id),c=We(o||[],["triage","started","unstarted","backlog","completed","canceled"]),n=(0,ni.groupBy)(t,a=>a.state.id);return(0,Tt.jsx)(Tt.Fragment,{children:c.map(a=>{let r=n[a.id]?.length===1?"1 issue":`${n[a.id]?.length} issues`;return(0,Tt.jsx)(hs.List.Section,{title:a.name,subtitle:r,children:n[a.id]?.map(l=>(0,Tt.jsx)(qt,{issue:l,mutateList:e,priorities:i,me:s},l.id))},a.id)})})}var de=require("react/jsx-runtime");function qi({projectId:e,priorities:t,me:i}){let{issues:s,isLoadingIssues:o,mutateList:c}=ge(Do,[e]),[n,a]=(0,Ps.useCachedState)(""),{milestones:r}=$e(e),l=(0,ks.useMemo)(()=>{if(!s)return[];if(!n||!r||r.length<1)return s;let d=[];for(let f of s)f.projectMilestone&&f.projectMilestone?.id===n&&d.push(f);return d||[]},[n,s,r]);return(0,de.jsxs)(Se.List,{isLoading:o,...r&&r.length>0?{searchBarAccessory:(0,de.jsxs)(Se.List.Dropdown,{tooltip:"Change Milestone",onChange:a,value:n,children:[(0,de.jsx)(Se.List.Dropdown.Item,{value:"",title:"All Milestones"}),(0,de.jsx)(Se.List.Dropdown.Section,{children:r?.map(d=>(0,de.jsx)(Se.List.Dropdown.Item,{value:d.id,title:`${d.name}  (${d.targetDate||"No Target Date"})`,icon:De(d)},d.id))})]})}:{},filtering:{keepSectionOrder:!0},searchBarPlaceholder:"Filter by ID, title, status, assignee or priority",children:[(0,de.jsx)(Se.List.EmptyView,{title:"No issues",description:"There are no issues in the project.",actions:(0,de.jsx)(Se.ActionPanel,{children:(0,de.jsx)(Se.Action.Push,{title:"Create Issue",target:(0,de.jsx)(Qt,{projectId:e,priorities:t,me:i})})})}),(0,de.jsx)(Vi,{issues:l,mutateList:c,priorities:t,me:i})]})}var q=require("@raycast/api"),Cs=require("date-fns"),ws=It(require("remove-markdown"));var Ss=require("@raycast/utils");function Wi(e){let{data:t,error:i,isLoading:s,mutate:o}=(0,Ss.useCachedPromise)(mo,[e]);return{updates:t,updatesError:i,isLoadingUpdates:s,mutateUpdates:o}}var ae=require("react/jsx-runtime"),Sr={onTrack:{color:q.Color.Green,title:"On Track"},atRisk:{color:q.Color.Orange,title:"At Risk"},offTrack:{color:q.Color.Red,title:"Off Track"}};function Qi({project:e}){let{updates:t,isLoadingUpdates:i,mutateUpdates:s}=Wi(e.id);return(0,ae.jsxs)(q.List,{isLoading:i,navigationTitle:`${e.name} \u2014 Project Updates`,searchBarPlaceholder:"Filter by user",isShowingDetail:!0,children:[(0,ae.jsx)(q.List.EmptyView,{title:"No updates",description:"This project doesn't have any updates."}),t?.map(o=>{let c=new Date(o.createdAt),{color:n,title:a}=Sr[o.health];return(0,ae.jsx)(q.List.Item,{title:o.user.displayName,icon:_(o.user),keywords:(0,ws.default)(o.body).replace(/\n/g," ").split(" "),accessories:[{date:c,tooltip:`Created: ${(0,Cs.format)(c,"EEEE d MMMM yyyy 'at' HH:mm")}`},{icon:q.Icon.Heartbeat,tag:{color:n,value:a}}],detail:(0,ae.jsx)(q.List.Item.Detail,{markdown:o.body}),actions:(0,ae.jsxs)(q.ActionPanel,{children:[(0,ae.jsx)(pe,{title:"Open Update",url:o.url}),(0,ae.jsxs)(q.ActionPanel.Section,{children:[(0,ae.jsx)(q.Action.CopyToClipboard,{icon:q.Icon.Clipboard,content:o.url,title:"Copy Update URL",shortcut:q.Keyboard.Shortcut.Common.CopyPath}),(0,ae.jsx)(q.Action.CopyToClipboard,{icon:q.Icon.Clipboard,content:o.body,title:"Copy Update",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]}),(0,ae.jsx)(q.ActionPanel.Section,{children:(0,ae.jsx)(q.Action,{title:"Refresh",icon:q.Icon.ArrowClockwise,shortcut:q.Keyboard.Shortcut.Common.Refresh,onAction:s})})]})},o.id)})]})}var ce=require("@raycast/api"),Bt=require("react");var Bi=require("@raycast/utils");var Cr=`
  id
  url
  icon
  color
  createdAt
  sortOrder
  title
  updatedAt
  project {
    id
    name
    icon
    color
  }
  initiative {
    id
    name
    color
    icon
  }
  creator {
    displayName
    avatarUrl
    email
  }
`;async function bs(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      query($documentId: ID!) {
        documents(filter: { id: { eq: $documentId } }) {
          nodes {
            content
            ${Cr}
          }
        }
      }
    `,{documentId:e});return i?.documents.nodes?.[0]}var Ds=require("lodash");var wr=`
  id
  url
  icon
  color
  createdAt
  sortOrder
  title
  updatedAt
  project {
    id
    name
    icon
    color
  }
  initiative {
    id
    name
    color
    icon
  }
  creator {
    displayName
    avatarUrl
    email
  }
`;async function As(e="",t={projectId:""}){let{graphQLClient:i}=k(),s="projectId"in t&&t.projectId.length>0,o="initiativeId"in t&&t.initiativeId.length>0,c=`nodes { ${wr} } pageInfo { hasNextPage }`,n=s?`
      query($query: String!, $projectId: ID!) {
        documents(orderBy: updatedAt, filter: { and: [
          { title: { containsIgnoreCase: $query } },
          { project: { id: { eq: $projectId } } }
        ] }) { ${c} } }
    `:o?`
      query($query: String!, $initiativeId: ID!) {
        documents(orderBy: updatedAt, filter: { and: [
          { title: { containsIgnoreCase: $query } },
          { initiative: { id: { eq: $initiativeId } } }
        ] }) { ${c} } }
    `:`
      query($query: String!) { documents(orderBy: updatedAt, filter: { title: { containsIgnoreCase: $query } }) { ${c} } }
    `,a=s||o?{query:e.trim(),...t}:{query:e.trim()},{data:r}=await i.rawRequest(n,a),l=(0,Ds.sortBy)(r?.documents.nodes??[],f=>f.sortOrder??1/0),d=!!r?.documents.pageInfo.hasNextPage;return{docs:l,hasMoreDocs:d}}function Ls(e="",t={projectId:""}){let{data:i,error:s,isLoading:o,mutate:c}=(0,Bi.useCachedPromise)(As,[e,t],{failureToastOptions:{title:"Failed to load documents"},keepPreviousData:!0});return{docs:i?.docs,docsError:s,isLoadingDocs:!i&&!s||o,supportsDocTypeahead:e.trim().length>0||i?.hasMoreDocs,mutateDocs:c}}function Ts(e){let{data:t,error:i,isLoading:s,mutate:o}=(0,Bi.useCachedPromise)(bs,[e],{failureToastOptions:{title:"Failed to load document content"}});return{doc:t,docError:i,isLoadingDoc:!t&&!i||s,mutateDoc:o}}var ue=require("@raycast/api"),Ms=require("date-fns");var ai=require("@raycast/api");function vs(e){return Oe({icon:e.icon??void 0,color:e.color??void 0,fallbackIcon:{source:ai.Icon.Document,tintColor:e.color??ai.Color.PrimaryText}})}var L=require("@raycast/api");async function $s(e){let{graphQLClient:t}=k(),{data:i}=await t.rawRequest(`
      mutation {
        documentDelete(id: "${e}") {
          success
        }
      }
    `);return{success:i?.documentDelete.success}}async function Rs(e,t){let{graphQLClient:i}=k(),s=`projectId: ${t.projectId?`"${t.projectId}"`:null}`;s+=`, initiativeId: ${t.initiativeId?`"${t.initiativeId}"`:null}`;let{data:o}=await i.rawRequest(`
      mutation {
        documentUpdate(id: "${e}", input: {${s}}) {
          success
        }
      }
    `);return{success:o?.documentUpdate.success}}var Z=require("react/jsx-runtime");function br({doc:e,mutateDocs:t,projects:i,initiatives:s,mutateDoc:o}){let c=async n=>{let a="project"in n,r=`to ${a?`Project: ${n.project.name}`:`Initiative: ${n.initiative.name}`}`,l=await(0,L.showToast)(L.Toast.Style.Animated,"Moving document",r),d=a?{projectId:n.project.id}:{initiativeId:n.initiative.id},f=t(Rs(e.id,d),{optimisticUpdate:C=>{if(!C)return;let y=a?{project:{...n.project},initiative:void 0}:{initiative:{...n.initiative},project:void 0};return{...C,docs:C.docs?.map(P=>P.id!==e.id?P:{...P,...y,updatedAt:new Date})}}});(o?o(f,{optimisticUpdate:C=>{if(!C)return;let y=a?{project:{...n.project},initiative:void 0}:{initiative:{...n.initiative},project:void 0};return{...C,...y,updatedAt:new Date}}}):f).then(({success:C})=>{C&&(l.style=L.Toast.Style.Success,l.title="Moved document")}).catch(C=>{l.style=L.Toast.Style.Failure,l.title="Failed to move document",l.message=U(C),l.primaryAction={title:"Retry",onAction:()=>c(n),shortcut:L.Keyboard.Shortcut.Common.Refresh}})};return((i??[]).length>0||(s??[]).length>0)&&(0,Z.jsxs)(L.ActionPanel.Submenu,{title:"Move Document",icon:L.Icon.Move,shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}},filtering:{keepSectionOrder:!0},children:[(s??[]).length>0&&(0,Z.jsx)(L.ActionPanel.Section,{title:"Initiatives",children:s?.filter(n=>n.id!==e.initiative?.id).map(n=>(0,Z.jsx)(L.Action,{title:n.name,icon:Ne(n),onAction:()=>c({initiative:n})},n.id))}),(i??[]).length>0&&(0,Z.jsx)(L.ActionPanel.Section,{title:"Projects",children:i?.filter(n=>n.id!==e.project?.id).map(n=>(0,Z.jsx)(L.Action,{title:n.name,icon:K(n),onAction:()=>c({project:n})},n.id))})]})}function Dr({doc:e,mutateDocs:t,deleteUnsupported:i}){if(i)return(0,Z.jsx)(Z.Fragment,{});let s=()=>(0,L.confirmAlert)({title:"Delete Document",message:`Are you sure you want to delete '${e.title}'?`,icon:{source:L.Icon.DeleteDocument,tintColor:L.Color.Red},primaryAction:{title:"Delete",style:L.Alert.ActionStyle.Destructive,onAction:o}}),o=async()=>{let c=await(0,L.showToast)(L.Toast.Style.Animated,"Deleting document",e.title);t($s(e.id),{optimisticUpdate:n=>{if(n)return{...n,docs:n.docs?.filter(a=>a.id!==e.id)}}}).then(({success:n})=>{n&&(c.style=L.Toast.Style.Success,c.title="Document deleted")}).catch(n=>{c.style=L.Toast.Style.Failure,c.title="Failed to delete document",c.message=U(n),c.primaryAction={title:"Retry",onAction:o,shortcut:L.Keyboard.Shortcut.Common.Refresh}})};return(0,Z.jsx)(L.Action,{title:"Delete Document",icon:{source:L.Icon.DeleteDocument,tintColor:L.Color.Red},onAction:s,style:L.Action.Style.Destructive,shortcut:L.Keyboard.Shortcut.Common.Remove})}function ci({doc:e,...t}){return(0,Z.jsxs)(Z.Fragment,{children:[(0,Z.jsx)(pe,{title:"Open Document",url:e.url}),(0,Z.jsxs)(L.ActionPanel.Section,{children:[(0,Z.jsx)(br,{doc:e,...t}),(0,Z.jsx)(Dr,{doc:e,...t})]}),(0,Z.jsxs)(L.ActionPanel.Section,{children:[(0,Z.jsx)(L.Action.CreateQuicklink,{icon:L.Icon.RaycastLogoPos,title:"Create Quicklink",shortcut:{macOS:{modifiers:["cmd","shift"],key:"s"},Windows:{modifiers:["ctrl","shift"],key:"s"}},quicklink:{link:e.url,name:e.title,application:Ot?"Linear":void 0}}),(0,Z.jsx)(L.Action.CopyToClipboard,{icon:L.Icon.Link,content:e.url,title:"Copy Link",shortcut:L.Keyboard.Shortcut.Common.CopyPath}),(0,Z.jsx)(L.Action.CopyToClipboard,{icon:L.Icon.Clipboard,content:e.title,title:"Copy Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]})]})}var $t=require("@raycast/api"),js=require("node-emoji");var vt=require("react/jsx-runtime");function xs({doc:e,...t}){let{doc:i,isLoadingDoc:s,mutateDoc:o}=Ts(e.id),c="";return i?.content&&(c=`# ${i.title}

${(0,js.emojify)(i.content)}`),(0,vt.jsx)($t.Detail,{markdown:c,isLoading:s,navigationTitle:e.title,actions:(0,vt.jsxs)($t.ActionPanel,{children:[(0,vt.jsx)($t.Action.CopyToClipboard,{title:"Copy Markdown",content:c}),i&&(0,vt.jsx)(ci,{doc:i,mutateDoc:o,...t,deleteUnsupported:!0})]})})}var mt=require("react/jsx-runtime");function Us({doc:e,...t}){let i=[e.project?.name??"",e.initiative?.name??"",e.title,e.creator.displayName],s=e.updatedAt?new Date(e.updatedAt):new Date(e.createdAt);return(0,mt.jsx)(ue.List.Item,{title:e.title,keywords:i,icon:vs(e),accessories:[...e.project?[{tag:{value:e.project.name,color:e.project.color?{light:e.project.color,dark:e.project.color,adjustContrast:!0}:ue.Color.SecondaryText},icon:K(e.project)}]:[],...e.initiative?[{tag:{value:e.initiative.name,color:e.initiative.color?{light:e.initiative.color,dark:e.initiative.color,adjustContrast:!0}:ue.Color.SecondaryText},icon:Ne(e.initiative)}]:[],{date:s,icon:ue.Icon.Clock,tooltip:`Updated: ${(0,Ms.format)(s,"MM/dd/yyyy")}`},{icon:_(e.creator),tooltip:`Creator: ${e.creator.displayName} (${e.creator.email})`}],actions:(0,mt.jsxs)(ue.ActionPanel,{children:[(0,mt.jsx)(ue.Action.Push,{title:"Show Content",target:(0,mt.jsx)(xs,{doc:e,...t}),icon:ue.Icon.Eye}),(0,mt.jsx)(ci,{doc:e,...t})]})},e.id)}var Ce=require("react/jsx-runtime");function Fs({project:e}){let[t,i]=(0,Bt.useState)(""),[s,o]=(0,Bt.useState)({projectId:""}),{projects:c,isLoadingProjects:n}=ne(),{initiatives:a,isLoadingInitiatives:r}=Ht(),{docs:l,isLoadingDocs:d,supportsDocTypeahead:f,mutateDocs:D}=Ls(t,s),C=(0,Bt.useMemo)(()=>{if(!l)return[];let y=l??[];if("initiativeId"in s&&s.initiativeId.length>0&&(a??[]).length>0)return y.filter(P=>P.initiative&&P.initiative.id===s.initiativeId);if((c??[]).length>0){if(e)return y.filter(P=>P.project&&P.project.id===e.id);if("projectId"in s&&s.projectId.length>0)return y.filter(P=>P.project&&P.project.id===s.projectId)}return y},[e,s,l,c,a]);return(0,Ce.jsxs)(ce.List,{isLoading:n||d||r,navigationTitle:e?`${e.name} Documents`:void 0,...!e&&((c??[]).length>0||(a??[]).length>0)?{searchBarAccessory:(0,Ce.jsxs)(ce.List.Dropdown,{tooltip:"Change Entity",onChange:y=>{let P=y.startsWith("initiative:")?{initiativeId:y.replace("initiative:","")}:{projectId:y.replace("project:","")};o(P)},storeValue:!0,children:[(0,Ce.jsx)(ce.List.Dropdown.Item,{value:"",title:"All Documents"}),(a??[]).length>0&&(0,Ce.jsx)(ce.List.Dropdown.Section,{title:"Initiatives",children:a?.map(y=>(0,Ce.jsx)(ce.List.Dropdown.Item,{value:`initiative:${y.id}`,title:y.name,icon:Ne(y),keywords:[y.name,y.description??""]},y.id))}),(c??[]).length>0&&(0,Ce.jsx)(ce.List.Dropdown.Section,{title:"Projects",children:c?.map(y=>(0,Ce.jsx)(ce.List.Dropdown.Item,{value:`project:${y.id}`,title:y.name,icon:K(y),keywords:[y.name,y.description]},y.id))})]})}:{},...f?{onSearchTextChange:i,searchBarPlaceholder:"Search by document title",throttle:!0}:{searchBarPlaceholder:"Filter by title, creator, project or initiative name"},children:[C.map(y=>(0,Ce.jsx)(Us,{doc:y,mutateDocs:D,projects:c,initiatives:a},y.id)),(0,Ce.jsx)(ce.List.EmptyView,{title:"No documents found",icon:{source:ce.Icon.DeleteDocument,tintColor:ce.Color.Orange}})]})}var Y=require("react/jsx-runtime");function Gi({project:e,priorities:t,me:i,mutateProjects:s}){let{linearClient:o}=k(),c=`${Math.round(e.progress*100)}%`,n=[e.status.name,...e.teams.nodes.map(f=>f.key)];e.lead&&n.push(e.lead.displayName,e.lead?.email);let a=()=>(0,A.confirmAlert)({title:"Delete Project",message:"Are you sure you want to delete the selected project?",icon:{source:A.Icon.Trash,tintColor:A.Color.Red},primaryAction:{title:"Delete",style:A.Alert.ActionStyle.Destructive,onAction:r}});async function r(){let f=await(0,A.showToast)({style:A.Toast.Style.Animated,title:"Deleting project"});s(o.archiveProject(e.id),{optimisticUpdate(D){return D&&D?.filter(C=>C.id!==e.id)}}).then(()=>{f.style=A.Toast.Style.Success,f.title="Project deleted",f.message=`"${e.name}" is deleted`}).catch(D=>{f.style=A.Toast.Style.Failure,f.title="Failed to delete project",f.message=U(D),f.primaryAction={title:"Retry",onAction:r,shortcut:A.Keyboard.Shortcut.Common.Refresh}})}let l=e.teams.nodes,d=e.targetDate?new Date(e.targetDate):null;return(0,Y.jsx)(A.List.Item,{title:e.name,subtitle:e.description,keywords:n,icon:K(e),accessories:[{icon:(0,Es.getProgressIcon)(e.progress,e.color,{background:"white"}),tooltip:`Progress: ${c}`},{icon:d?ht(d):void 0,text:d?(0,zi.format)(d,"MMM dd"):void 0,tooltip:d?`Target date: ${(0,zi.format)(d,"MM/dd/yyyy")}`:void 0},{icon:A.Icon.PersonLines,text:l.length>1?`${l.length}`:l[0].key,tooltip:`Teams: ${l.map(f=>f.key).join(", ")}`},{icon:{source:Kt[e.status.type]},tooltip:e.status.name},{icon:_(e.lead),tooltip:e.lead?`Lead: ${e.lead?.displayName} (${e.lead?.email})`:"Unassigned"}],actions:(0,Y.jsxs)(A.ActionPanel,{title:e.name,children:[(0,Y.jsx)(A.Action.Push,{target:(0,Y.jsx)(qi,{projectId:e.id,priorities:t,me:i}),title:"Show Issues",icon:A.Icon.List}),(0,Y.jsx)(pe,{title:"Open Project",url:e.url}),(0,Y.jsx)(A.Action.Push,{target:(0,Y.jsx)(fi,{projectId:e.id}),title:"Create Milestone",shortcut:{macOS:{modifiers:["cmd","shift"],key:"m"},Windows:{modifiers:["ctrl","shift"],key:"m"}},icon:{source:"linear-icons/milestone.svg",tintColor:A.Color.PrimaryText}}),(0,Y.jsxs)(A.ActionPanel.Section,{children:[(0,Y.jsx)(A.Action.Push,{title:"Edit Project",icon:A.Icon.Pencil,shortcut:A.Keyboard.Shortcut.Common.Edit,target:(0,Y.jsx)(yi,{project:e,mutateProjects:s})}),(0,Y.jsx)(A.Action.Push,{title:"See Project Updates",icon:A.Icon.Heartbeat,shortcut:{macOS:{modifiers:["cmd","shift"],key:"u"},Windows:{modifiers:["ctrl","shift"],key:"u"}},target:(0,Y.jsx)(Qi,{project:e})}),(0,Y.jsx)(A.Action.Push,{title:"See Project Documents",icon:A.Icon.Document,shortcut:{macOS:{modifiers:["cmd","shift"],key:"d"},Windows:{modifiers:["ctrl","shift"],key:"d"}},target:(0,Y.jsx)(Fs,{project:e})}),(0,Y.jsx)(A.Action,{title:"Delete Project",onAction:a,style:A.Action.Style.Destructive,icon:A.Icon.Trash,shortcut:A.Keyboard.Shortcut.Common.Remove})]}),(0,Y.jsxs)(A.ActionPanel.Section,{children:[(0,Y.jsx)(A.Action.CopyToClipboard,{icon:A.Icon.Clipboard,content:e.url,title:"Copy Project URL",shortcut:A.Keyboard.Shortcut.Common.CopyPath}),(0,Y.jsx)(A.Action.CopyToClipboard,{icon:A.Icon.Clipboard,content:e.name,title:"Copy Project Title",shortcut:{macOS:{modifiers:["cmd","shift"],key:"'"},Windows:{modifiers:["ctrl","shift"],key:"'"}}})]})]})},e.id)}var Ue=require("react/jsx-runtime");function _i(){let[e,t]=(0,zt.useState)(""),[i,s]=(0,zt.useState)(""),{projects:o,isLoadingProjects:c,mutateProjects:n,pagination:a}=ne(void 0,{searchText:i,pageSize:20}),{initiatives:r,isLoadingInitiatives:l}=Ht(),{priorities:d,isLoadingPriorities:f}=Ut(),{me:D,isLoadingMe:C}=Ye(),y=(0,zt.useMemo)(()=>{if(!o)return[];if(!(r??[]).length||!e.length)return o;let P=o.reduce((v,g)=>({...v,[g.id]:g}),{});return(r?.find(v=>v.id===e)?.projects?.nodes??[]).map(v=>P[v.id])},[e,o,r]);return(0,Ue.jsxs)(pt.List,{isLoading:c||l||f||C,...(r??[]).length>0?{searchBarAccessory:(0,Ue.jsxs)(pt.List.Dropdown,{tooltip:"Change Initiative",onChange:t,storeValue:!0,children:[(0,Ue.jsx)(pt.List.Dropdown.Item,{value:"",title:"All Projects"}),(0,Ue.jsx)(pt.List.Dropdown.Section,{title:"Initiatives",children:r?.map(P=>(0,Ue.jsx)(pt.List.Dropdown.Item,{value:P.id,title:P.name,icon:Ne(P)},P.id))})]})}:{},filtering:{keepSectionOrder:!0},onSearchTextChange:s,pagination:a,searchBarPlaceholder:"Filter by project title, lead, status, or team keys",searchText:i,throttle:!0,children:[y?.map(P=>P?(0,Ue.jsx)(Gi,{project:P,priorities:d,me:D,mutateProjects:n},P.id):null),(0,Ue.jsx)(pt.List.EmptyView,{title:e?"There are no projects in this initiative.":"There are no projects in this workspace."})]})}var jt=require("@raycast/api"),Os=require("@raycast/utils"),li=It(require("react"));var Rt=require("react/jsx-runtime");function Ar({children:e}){return(0,li.useEffect)(()=>{wo()},[]),e}var Hi=class extends li.default.Component{constructor(t){super(t),this.state={error:null}}static getDerivedStateFromError(t){return{error:t}}render(){let{error:t}=this.state;if(!t)return this.props.children;if(!(t.message.includes("invalid_grant")||t.message.includes("Error while fetching tokens")||t.message.includes("Could not initialize OAuth")))throw t;return(0,Rt.jsx)(jt.Detail,{markdown:`# Sign In Failed

Failed to authenticate with Linear:
\`\`\`
${t.message}
\`\`\`

This can happen when the network is unreliable or the authorization code has expired. Please try signing in again.`,actions:(0,Rt.jsx)(jt.ActionPanel,{children:(0,Rt.jsx)(jt.Action,{title:"Sign in Again",onAction:async()=>{await gi.client.removeTokens(),this.setState({error:null})}})})})}},Lr=(0,Os.withAccessToken)(gi)(Ar);function Zi({children:e}){return(0,Rt.jsx)(Hi,{children:(0,Rt.jsx)(Lr,{children:e})})}var Ki=require("react/jsx-runtime");function Ns(){return(0,Ki.jsx)(Zi,{children:(0,Ki.jsx)(_i,{})})}
