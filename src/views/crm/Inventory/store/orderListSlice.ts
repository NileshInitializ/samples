import {
    createSlice,
    createAsyncThunk,
    current,
    PayloadAction,
} from '@reduxjs/toolkit'
import {
    apiGetSalesOrders,
    apiDeleteSalesOrders,
} from '@/services/SalesService'
import type { TableQueries } from '@/@types/common'


export type MomAttendees = {
    client_name: string;
    organisor: string;
    designer: string;
    attendees: string;
  };
  
  export type MomFile = string;
  export const SLICE_NAME = 'momData'
  export interface ProjectMomItem {
    project_id: string;
    project_name: string;
    mom_id: string;
    client_name: string;
    location: string;
    meetingDate: string;
  }
  
  export interface ProjectMomApiResponse {
    message: string;
    status: boolean;
    errorMessage: string;
    code: number;
    data: ProjectMomItem[];
  }
  
  export type ApiResponse = {
    message: string;
    status: boolean;
    errorMessage: string;
    code: number;
    data: ProjectMom[];
  };
  

type Order = {
    project_id?: string
    project_name?: string
    meetingSource?:string
    client_name: string
    client_contact: string
    project_type: string
    description: string
    project_status: string
    project_start_date:string
    timeline_date:string
    project_end_date:string
    mom:MOM[]
}
type MOM = {
    mom_id:string
    meetingdate:string
    source:string
}

type Orders = Order[]

type GetSalesOrdersResponse = {
    data: Orders
    total: number
}

export type SalesOrderListState = {
    loading: boolean
    orderList: Orders
    tableData: TableQueries
    deleteMode: 'single' | 'batch' | ''
    selectedRows: string[]
    selectedRow: string
}


export const getOrders = createAsyncThunk(
    SLICE_NAME + '/getOrders',
    async (data: TableQueries) => {
        const response = await apiGetSalesOrders<
            GetSalesOrdersResponse,
            TableQueries
        >(data)
        return response.data
    }
)

export const deleteOrders = async (data: { id: string | string[] }) => {
    const response = await apiDeleteSalesOrders<
        boolean,
        { id: string | string[] }
    >(data)
    return response.data
}

const initialState: SalesOrderListState = {
    loading: false,
    orderList: [],
    tableData: {
        total: 0,
        pageIndex: 1,
        pageSize: 10,
        query: '',
        sort: {
            order: '',
            key: '',
        },
    },
    selectedRows: [],
    selectedRow: '',
    deleteMode: '',
}

const orderListSlice = createSlice({
    name: `${SLICE_NAME}/state`,
    initialState,
    reducers: {
        setOrderList: (state, action) => {
            state.orderList = action.payload
        },
        setTableData: (state, action) => {
            state.tableData = action.payload
        },
        setSelectedRows: (state, action) => {
            state.selectedRows = action.payload
        },
        setSelectedRow: (state, action) => {
            state.selectedRow = action.payload
        },
        addRowItem: (state, { payload }) => {
            const currentState = current(state)
            if (!currentState.selectedRows.includes(payload)) {
                state.selectedRows = [...currentState.selectedRows, ...payload]
            }
        },
        removeRowItem: (state, { payload }: PayloadAction<string>) => {
            const currentState = current(state)
            if (currentState.selectedRows.includes(payload)) {
                state.selectedRows = currentState.selectedRows.filter(
                    (id) => id !== payload
                )
            }
        },
        setDeleteMode: (state, action) => {
            state.deleteMode = action.payload
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(getOrders.fulfilled, (state, action) => {
                state.orderList = action.payload.data
                state.tableData.total = action.payload.total
                state.loading = false
            })
            .addCase(getOrders.pending, (state) => {
                state.loading = true
            })
    },
})

export const {
    setOrderList,
    setTableData,
    setSelectedRows,
    setSelectedRow,
    addRowItem,
    removeRowItem,
    setDeleteMode,
} = orderListSlice.actions

export default orderListSlice.reducer
