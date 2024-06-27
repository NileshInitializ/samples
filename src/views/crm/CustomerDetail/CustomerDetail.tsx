import { useEffect, useState } from 'react'
import Container from '@/components/shared/Container'
import CustomerProfile from './components/CustomerProfile'
import PaymentHistory from './components/Quotation'
import reducer, { getCustomer, useAppDispatch } from './store'
import { injectReducer } from '@/store'
import useQuery from '@/utils/hooks/useQuery'
import MOM from './components/MOM/Mom'
import { Tabs } from '@/components/ui'
import TabList from '@/components/ui/Tabs/TabList'
import TabNav from '@/components/ui/Tabs/TabNav'
import TabContent from '@/components/ui/Tabs/TabContent'
import { useLocation } from 'react-router-dom'
import AllMom from './components/MOM/AllMom'
import { apiGetCrmFileManagerProjects, apiGetCrmSingleProjectQuotation, apiGetCrmSingleProjects } from '@/services/CrmService'
import Quotations from './Quotation/Quotations'
import { FileItem } from '../FileManager/Components/Project/data'
import Index from './Quotation'
import Contract from './components/Contract'
import { MomProvider } from './store/MomContext'
import { ProjectProvider } from '../Customers/store/ProjectContext'

injectReducer('crmCustomerDetails', reducer)

const CustomerDetail = () => {
    const dispatch = useAppDispatch()
    const query = useQuery()
    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const fetchData = () => {
        const id = query.get('lead_id')
        if (id) {
            dispatch(getCustomer({ id }))
        }
    }
    interface QueryParams {
        id: string;
        project_id: string;
        mom:string
      
      }
      const [fileData,setFileData]=useState<FileItem[]>();
    const location = useLocation();
    const role=localStorage.getItem('role');
    const queryParams = new URLSearchParams(location.search);
    const allQueryParams: QueryParams = {
      id: queryParams.get('id') || '',
      project_id: queryParams.get('project_id') || '',
      mom: queryParams.get('type') || '',
    };
    const [details, setDetails] = useState<any | null>(null);
    const[momdata,setmomdata]= useState<any | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await apiGetCrmSingleProjects(allQueryParams.project_id);
                const data = response
                setDetails(data.data[0]);
                setmomdata(data.data[0].mom)
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDataAndLog = async () => {
          try {
            const leadData = await apiGetCrmSingleProjectQuotation(allQueryParams.project_id);
            console.log(leadData.data);
           setFileData(leadData.data)
          } catch (error) {
            console.error('Error fetching lead data', error);
          }
        };
    
        fetchDataAndLog();
      }, []);
      
      return (
        <>
        <h3 className='pb-5'>Project-{details?details.project_name:""}</h3>
        <div>
          <ProjectProvider>
          <MomProvider>
        <Tabs defaultValue={allQueryParams.mom}>
            <TabList>
                <TabNav value="tab1">Details</TabNav>
                {(role === 'ADMIN' || role === 'Senior Architect' || role === 'Executive Assistant') && (
                  <TabNav value="tab2">Quotation</TabNav>
                )}{role !== 'Executive Assistant' && (
                  <>
                    <TabNav value="mom">MOM</TabNav>
                    <TabNav value="tab5">All MOM</TabNav>
                  </>
                )}
            </TabList>
            <div className="p-4">
                <TabContent value="tab1">
                    <Container>
                        <CustomerProfile data={details}/>
                    </Container>
                </TabContent>
                <TabContent value="tab2">
                  <Index data={fileData }/>
                </TabContent>
                <TabContent value="mom">
                  <MOM data={details} />
                </TabContent>
              
                <TabContent value="tab5">
                  <AllMom data={momdata}/>
                </TabContent>
            </div>
        </Tabs>
        </MomProvider>
        </ProjectProvider>
    </div>
    </>);
 
};


export default CustomerDetail
