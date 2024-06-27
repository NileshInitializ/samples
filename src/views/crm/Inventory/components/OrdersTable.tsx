import { useEffect, useCallback, useMemo, useRef } from 'react'
import Badge from '@/components/ui/Badge'
import Tooltip from '@/components/ui/Tooltip'
import DataTable from '@/components/shared/DataTable'
import { HiOutlineEye, HiOutlineTrash } from 'react-icons/hi'
import { NumericFormat } from 'react-number-format'
import {
    setSelectedRows,
    addRowItem,
    removeRowItem,
    setDeleteMode,
    setSelectedRow,
    getOrders,
    setTableData,
    useAppDispatch,
    useAppSelector,
} from '../store'
import useThemeClass from '@/utils/hooks/useThemeClass'
import { useNavigate } from 'react-router-dom'
import cloneDeep from 'lodash/cloneDeep'
import type {
    DataTableResetHandle,
    OnSortParam,
    ColumnDef,
    Row,
} from '@/components/shared/DataTable'

type Order = {
    id: string
    project_id: string
    project_name:string
    date: number
    customer: string
    status: number
    paymentMehod: string
    paymentIdendifier: string
    totalAmount: number
    mom:MOM[]
}
type MOM={
    meetingdate:string
    location:string
    attendees:Attendees
}
type Attendees={
    client_name:[]
}

const orderStatusColor: Record<
    number,
    {
        label: string
        dotClass: string
        textClass: string
    }
> = {
    0: {
        label: 'Paid',
        dotClass: 'bg-emerald-500',
        textClass: 'text-emerald-500',
    },
    1: {
        label: 'Pending',
        dotClass: 'bg-amber-500',
        textClass: 'text-amber-500',
    },
    2: { label: 'Failed', dotClass: 'bg-red-500', textClass: 'text-red-500' },
}

const PaymentMethodImage = ({
    paymentMehod,
    className,
}: {
    paymentMehod: string
    className: string
}) => {
    switch (paymentMehod) {
        case 'visa':
            return (
                <img
                    className={className}
                    src="/img/others/img-8.png"
                    alt={paymentMehod}
                />
            )
        case 'master':
            return (
                <img
                    className={className}
                    src="/img/others/img-9.png"
                    alt={paymentMehod}
                />
            )
        case 'paypal':
            return (
                <img
                    className={className}
                    src="/img/others/img-10.png"
                    alt={paymentMehod}
                />
            )
        default:
            return <></>
    }
}

const OrderColumn = ({ row }: { row: Order }) => {
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onView =() => {
        navigate(`/app/crm/customer-details?project_id=${row.project_id}&id=65c32e19e0f36d8e1f30955c`)
    }

    return (
        <span
            className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
        >
        </span>
    )
}

const ActionColumn = ({ row }: { row: Order }) => {
    const dispatch = useAppDispatch()
    const { textTheme } = useThemeClass()
    const navigate = useNavigate()

    const onDelete = () => {
        dispatch(setDeleteMode('single'))
        dispatch(setSelectedRow([row.id]))
    }

    const onView = useCallback(() => {
        navigate(``)
    }, [navigate, row])

    return (
        <div className="flex justify-end text-lg">
            <Tooltip title="View">
                <span
                    className={`cursor-pointer p-2 hover:${textTheme}`}
                    onClick={()=> navigate(`/app/crm/proejct-details?project_id=${row.project_id}&id=65c32e19e0f36d8e1f30955c&type=mom`)}
                >
                    <HiOutlineEye />
                </span>
            </Tooltip>
            {/* <Tooltip title="Delete">
                <span
                    className="cursor-pointer p-2 hover:text-red-500"
                    onClick={onView}
                >
                    <HiOutlineEye />
                </span>
            </Tooltip> */}
        </div>
    )
}

const OrdersTable = () => {
    const tableRef = useRef<DataTableResetHandle>(null)

    const dispatch = useAppDispatch()

    const { pageIndex, pageSize, sort, query, total } = useAppSelector(
        (state) => state.salesOrderList.data.tableData
    )
    const loading = useAppSelector((state) => state.salesOrderList.data.loading)

    const data = useAppSelector((state) => state.salesOrderList.data.orderList)

    const fetchData = useCallback(() => {
        console.log('{ pageIndex, pageSize, sort, query }', {
            pageIndex,
            pageSize,
            sort,
            query,
        })
        dispatch(getOrders({ pageIndex, pageSize, sort, query }))
    }, [dispatch, pageIndex, pageSize, sort, query])

    useEffect(() => {
        dispatch(setSelectedRows([]))
        fetchData()
    }, [dispatch, fetchData, pageIndex, pageSize, sort])

    useEffect(() => {
        if (tableRef) {
            tableRef.current?.resetSelected()
        }
    }, [data])

    const tableData = useMemo(
        () => ({ pageIndex, pageSize, sort, query, total }),
        [pageIndex, pageSize, sort, query, total]
    )

    const formatDate = (dateString: string) => {
        const date = new Date(dateString)
        const day = String(date.getUTCDate()).padStart(2, '0')
        const month = String(date.getUTCMonth() + 1).padStart(2, '0') // Months are 0-based in JavaScript
        const year = date.getUTCFullYear()
      
        return `${day}-${month}-${year}`
      }

    const columns: ColumnDef<Order>[] = useMemo(
        () => [
          
            {
                header: 'Project',
                accessorKey: 'project_name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span>{row.project_name}</span>
                    )
                },
            },
            {
                header: 'Date',
                accessorKey: 'meeting',
                cell: (props) => {
                    const row = props.row.original;
                    // const formattedDate = formatDate(row.mom[0].meetingdate);
                    return row.mom[0].meetingdate;
                },
            },
            {
                header: 'Client ',
                accessorKey: 'client_name',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span>{row.mom[0].attendees.client_name}</span>
                    )
                },
            },
       
            {
                header: 'Location',
                accessorKey: 'location',
                cell: (props) => {
                    const row = props.row.original
                    return (
                        <span>{row.mom[0].location}</span>
                    )
                },
            },
            // {
            //     header: 'Total',
            //     accessorKey: 'totalAmount',
            //     cell: (props) => {
            //         const { totalAmount } = props.row.original
            //         return (
            //             <NumericFormat
            //                 displayType="text"
            //                 value={(
            //                     Math.round(totalAmount * 100) / 100
            //                 ).toFixed(2)}
            //                 prefix={'$'}
            //                 thousandSeparator={true}
            //             />
            //         )
            //     },
            // },
            {
                header: '',
                id: 'action',
                cell: (props) => <ActionColumn row={props.row.original} />,
            },
        ],
        []
    )

    const onPaginationChange = (page: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageIndex = page
        dispatch(setTableData(newTableData))
    }

    const onSelectChange = (value: number) => {
        const newTableData = cloneDeep(tableData)
        newTableData.pageSize = Number(value)
        newTableData.pageIndex = 1
        dispatch(setTableData(newTableData))
    }

    const onSort = (sort: OnSortParam) => {
        const newTableData = cloneDeep(tableData)
        newTableData.sort = sort
        dispatch(setTableData(newTableData))
    }

    const onRowSelect = (checked: boolean, row: Order) => {
        if (checked) {
            dispatch(addRowItem([row.id]))
        } else {
            dispatch(removeRowItem(row.id))
        }
    }

    const onAllRowSelect = useCallback(
        (checked: boolean, rows: Row<Order>[]) => {
            if (checked) {
                const originalRows = rows.map((row) => row.original)
                const selectedIds: string[] = []
                originalRows.forEach((row) => {
                    selectedIds.push(row.id)
                })
                dispatch(setSelectedRows(selectedIds))
            } else {
                dispatch(setSelectedRows([]))
            }
        },
        [dispatch]
    )

    return (
        <DataTable
            ref={tableRef}
            columns={columns}
            data={data}
            loading={loading}
            pagingData={{
                total: tableData.total as number,
                pageIndex: tableData.pageIndex as number,
                pageSize: tableData.pageSize as number,
            }}
            onPaginationChange={onPaginationChange}
            onSelectChange={onSelectChange}
            onSort={onSort}
            onCheckBoxChange={onRowSelect}
            onIndeterminateCheckBoxChange={onAllRowSelect}
        />
    )
}

export default OrdersTable