import React, { useEffect, useState } from 'react';
import { FolderItem, fetchProjectData } from './data';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Dialog, Notification, toast } from '@/components/ui';
import type { MouseEvent } from 'react';
import YourFormComponent from './ProjectForm';
import { FaFolder } from 'react-icons/fa';
import { ConfirmDialog, StickyFooter } from '@/components/shared';
import { HiTrash } from 'react-icons/hi';
import { apiDeleteFileManagerFolders } from '@/services/CrmService';

const Index = () => {
  const [projectData, setProjectData] = useState<FolderItem[]>([]);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const projectId = queryParams.get('project_id');
  const projectName = queryParams.get('project_name');
  useEffect(() => {
    const fetchDataAndLog = async () => {
      try {
        const projectData = await fetchProjectData(projectId);
        console.log(projectData);
        setProjectData(projectData);
      } catch (error) {
        console.error('Error fetching lead data', error);
      }
    };

    fetchDataAndLog();
  }, []);
  const navigate = useNavigate();
const role=localStorage.getItem('role');
  const [dialogIsOpen, setIsOpen] = useState(false);
  const openDialog = () => {
    setIsOpen(true);
  };

  const onDialogClose = (e: MouseEvent) => {
    console.log('onDialogClose', e);
    setIsOpen(false);
  };
console.log(projectData);

const [dialogIsOpen2, setIsOpen2] = useState(false)
const [folderName, setFolderName] = useState<string>('')

const openDialog2 = (folder_name:string) => {
    setIsOpen2(true)
    setFolderName(folder_name)
}

const onDialogClose2 = () => {
    setIsOpen2(false)
}


const deleteFolders = async (folder_name:string) => {
  function warn(text:string) {
    toast.push(
        <Notification closable type="warning" duration={2000}>
            {text}
        </Notification>,{placement:'top-center'}
    )
}
  if (folder_name.length === 0) {
    warn('No files selected for deletion.')
    return;
  }   
  const postData = {
    lead_id:"",
    folder_name: folder_name,
    type:"",
    project_id:projectId
  };
  try {
    await apiDeleteFileManagerFolders(postData);
    toast.push(
      <Notification closable type="success" duration={2000}>
        Folder deleted successfully
      </Notification>,{placement:'top-center'}
    )
    window.location.reload()
  } catch (error) {
    toast.push(
      <Notification closable type="danger" duration={2000}>
        Error deleting folder
      </Notification>,{placement:'top-center'}
    )
  }
  
}

function formatDate(dateString:string) {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, '0');
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}




  return (
      <div>
          <div className=" mb-5 flex justify-between">
              <h3 className=" capitalize">Project-{projectName}</h3>
              <Button variant="solid" size="sm" onClick={() => openDialog()}>
                  Upload
              </Button>
          </div>
          {projectData.length === 0 ? (
              <p>
                  No folders available. Click the button above to add folders.
              </p>
          ) : (
            <div className=" w-full">
            <div className="flex-1 p-4">
            <div className="flex items-center mb-4">
        <nav className="flex">
          <ol className="flex items-center space-x-2">
            <li>
              <Link to={`/app/crm/fileManager`} className="text-blue-600 dark:text-blue-400 hover:underline">FileManager</Link>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
            <li>
            <li className="text-gray-500">Projects</li>
            </li>
            <li>
              <span className="mx-2">/</span>
            </li>
          
            <li className="text-gray-500">{projectName}</li>
          </ol>
        </nav>
      </div>
              <div className="border rounded-lg shadow-sm dark:border-gray-700">
                <div className="relative w-full overflow-auto">
                  <table className="w-full caption-bottom text-sm">
                    <thead className="[&amp;_tr]:border-b">
                      <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                          Name
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                          Type
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                          Files
                        </th>
                        <th className="h-12 px-4 text-left align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0">
                          Modified
                        </th>
                        <th className="h-12 px-4 align-middle font-medium text-muted-foreground [&amp;:has([role=checkbox])]:pr-0  ">
                          Actions
                        </th>
                      </tr>
                    </thead>
                <tbody className="[&amp;_tr:last-child]:border-0">
                {projectData.map((item) => {
                    if (role === 'ADMIN' || role === 'Senior Architect' || (item.folder_name !== 'quotation' && item.folder_name !== 'contract')) {
                  return(
                  <tr key={item.folder_name} className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">
                      <div className="flex items-center gap-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          stroke-width="2"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          className="h-5 w-5 text-gray-500 dark:text-gray-400"
                        >
                          <path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"></path>
                        </svg>
                        <a className="font-medium cursor-pointer" onClick={()=> navigate(
                                     `/app/crm/fileManager/project/folder?project_id=${projectId}&project_name=${projectName}&folder_name=${item.folder_name}`,
                                )}>
                          {item.folder_name}
                        </a>
                      </div>
                    </td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">Folder</td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0">{Number(item.total_files)>1?`${item.total_files} items`:`${item.total_files} item`}</td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0"> {(item.updated_date)?formatDate(item.updated_date):"-"}</td>
                    <td className="p-4 align-middle [&amp;:has([role=checkbox])]:pr-0 text-center">
                      <div className=' flex justify-center cursor-pointer' onClick={()=>openDialog2(item.folder_name)}>
                    <HiTrash className=' text-xl text-center hover:text-red-500'/>
                    </div>
                    </td>
                  </tr>)}})}
                
                </tbody>
      
                  </table>
                </div>
              </div>
            </div>
          </div>
          )}
          <StickyFooter
              className="-mx-8 px-8 flex items-center justify-between py-4 mt-7"
              stickyClass="border-t bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
          >
              <div className="md:flex items-center">
                  <Button
                      size="sm"
                      className="ltr:mr-3 rtl:ml-3"
                      type="button"
                      onClick={() => {
                          navigate('/app/crm/fileManager')
                      }}
                  >
                      Back
                  </Button>
              </div>
          </StickyFooter>
          <Dialog
              isOpen={dialogIsOpen}
              onClose={onDialogClose}
              onRequestClose={onDialogClose}
              className={`h-300px`}
          >
              <YourFormComponent data={projectData} />
          </Dialog>

          <ConfirmDialog
          isOpen={dialogIsOpen2}
          type="danger"
          onClose={onDialogClose2}
          confirmButtonColor="red-600"
          onCancel={onDialogClose2}
          onConfirm={() => deleteFolders(folderName)}
          title="Delete Folder"
          onRequestClose={onDialogClose2}>
            <p> Are you sure you want to delete this folder? </p>            
        </ConfirmDialog>
      </div>
  )
};

export default Index;
