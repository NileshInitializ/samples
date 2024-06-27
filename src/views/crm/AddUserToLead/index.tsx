import React, { useEffect, useState } from 'react';
import { Formik, Field, Form } from 'formik';
import axios from 'axios';
import { Button, FormItem, Input, Notification, Select, toast } from '@/components/ui';
import { apiAddMember, apiAddMemberToLead } from '@/services/AuthService';
import { apiGetUsers } from '@/services/CommonService';
import { apiGetCrmLeads, apiGetCrmProjects } from '@/services/CrmService';

interface FormValues {
  id: string;
  role: string;
  user_name: string;
  lead_id: string;
}

interface User {
  username: string;
  role: string;
}
interface Projects {
  lead_id: string;
  name: string;
}
const response = await apiGetUsers();
const leads = await apiGetCrmLeads();
const id=localStorage.getItem('userId');
const token=localStorage.getItem('auth');
const Index = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [filteredLeads, setFilteredLeads] = useState<Projects[]>([]);
  const [selectedProject, setSelectedProject] = useState<string | null>(null);

  const Options = [
    { value: 'Jr. Interior Designer', label: 'Jr. Interior Designer' },
    { label: 'Executive Assistant', value: 'Executive Assistant' },
    { value: 'Project Architect', label: 'Project Architect' },
  ];

  useEffect(() => {
    const fetchUsers = async () => {
      setUsers(response.data);
      console.log(leads);
      
      setSelectedProject(leads.data.leads);
    };

    fetchUsers();
  },[]);
  useEffect(() => {
    setFilteredUsers(
      users.filter((user) => user.role === selectedRole)
    );
    setFilteredLeads(
      leads.data.leads
    );
  }, [selectedRole, users]);

  

  const handleSubmit = async (values: FormValues) => {
    const response=await apiAddMemberToLead(values,token);
    const responseData=  await response.json();
    if(response.status===200){
     
      toast.push(
        <Notification closable type="success" duration={2000}>
            Member Added Successfully
        </Notification>
    
     )
      
    }
    else{
      toast.push(
        <Notification closable type="danger" duration={2000}>
            {responseData.errorMessage}
        </Notification>
    
     )
      console.log(responseData);
      
    }
    console.log(responseData);
  };

  return (
    <Formik
      initialValues={{
        id:id || '',
        role: '',
        user_name: '',
        lead_id: '',
      }}
      onSubmit={handleSubmit}
    >
      {({ setFieldValue }) => (
        <Form className='w-2/5'>
          <h3 className='mb-4'>Add User To Lead</h3>
          <FormItem label="Role">
            <Select
              options={Options}
              onChange={(option) => {
                setSelectedRole(option?.value || null);
                setFieldValue('role', option?.value || '');
              }}
            />
          </FormItem>
          <FormItem label="User Name">
            <Select
              options={filteredUsers.map((user) => ({ value: user.username, label: user.username }))}
              onChange={(option) => setFieldValue('user_name', option?.value || '')}
            />
          </FormItem>
          <FormItem label="Lead Name">
          <Select
              options={filteredLeads.map((leads) => ({ value: leads.lead_id, label: leads.name }))}
              onChange={(option) => setFieldValue('lead_id', option?.value || '')}
            />
          </FormItem>

          <Button type="submit" variant='solid'>Submit</Button>
        </Form>
      )}
    </Formik>
  );
};

export default Index;