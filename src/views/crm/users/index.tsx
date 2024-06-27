
import { useMemo, useState, useEffect } from 'react'
import Table from '@/components/ui/Table'
import Input from '@/components/ui/Input'
import {
    useReactTable,
    getCoreRowModel,
    getFilteredRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFacetedMinMaxValues,
    getPaginationRowModel,
    getSortedRowModel,
    flexRender,
} from '@tanstack/react-table'
import { rankItem } from '@tanstack/match-sorter-utils'
import type { ColumnDef, FilterFn, ColumnFiltersState } from '@tanstack/react-table'
import type { InputHTMLAttributes } from 'react'
import { apiDeleteUsers, apiGetUsers } from '@/services/CommonService'
import { BiTrash } from 'react-icons/bi'
import { Notification, Pagination, Select, toast } from '@/components/ui'

type User = {
    username: string;
    role: string;
    email: string;
    UserId: string;
  };
  
  type ApiResponse = {
    message: string;
    status: boolean;
    errorMessage: string;
    code: number;
    data: User[];
  };

interface DebouncedInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'size' | 'prefix'> {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
}

const { Tr, Th, Td, THead, TBody, Sorter } = Table

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}: DebouncedInputProps) {
    const [value, setValue] = useState(initialValue)

    useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce)

        return () => clearTimeout(timeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value])

    return (
        <div className="flex justify-end">
            <div className="flex items-center mb-4">
                <span className="mr-2">Search:</span>
                <Input
                    {...props}
                    value={value}
                    onChange={(e) => setValue(e.target.value)}
                />
            </div>
        </div>
    )
}

const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {

    const itemRank = rankItem(row.getValue(columnId), value)
    addMeta({
        itemRank,
    })
    return itemRank.passed
}


const pageSizeOption = [
    { value: 10, label: '10 / page' },
    { value: 20, label: '20 / page' },
    { value: 30, label: '30 / page' },
    { value: 40, label: '40 / page' },
    { value: 50, label: '50 / page' },
]

const Users = () => {
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [globalFilter, setGlobalFilter] = useState('')
    const [data, setData] = useState<User[]>([]); // initialize data as an empty array

    useEffect(() => {
      const fetchData = async () => {
        const response = await apiGetUsers(); 
        const data: ApiResponse =  response
        setData(data.data);
      };
     
  
      fetchData();
    }, []);

    const deleteuser=async(UserId:string)=>{
        const response=await apiDeleteUsers(UserId);
        console.log(response);
        const data=await response.json()
        console.log(data);
        
        if(data.code===200){
            toast.push(
                <Notification closable type="success" duration={2000}>
                    {data.message}
                </Notification>

            )
            window.location.reload();
        }
        else{
            toast.push(
                <Notification closable type="danger" duration={2000}>
                    {data.errorMessage}
                </Notification>
            )
        }


      }

    const columns = useMemo<ColumnDef<User>[]>(
        () => [
            { header: 'Username', accessorKey: 'username' },
            { header: 'Role', accessorKey: 'role' },
            { header: 'Email', accessorKey: 'email' },
            { header: 'Action',id:"action",
            cell: ({row}) => {
                return (
                    <div className="">
                       
                        <p className=" text-xl hover:text-red-500" onClick={()=>deleteuser(row.original.UserId)}><BiTrash/></p>
                    </div>
                )
            },
        }
        ],
        []
    )

    const [datas] = useState(() => data)

    const table = useReactTable({
        data,
        columns,
        filterFns: {
            fuzzy: fuzzyFilter,
        },
        state: {
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: fuzzyFilter,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        getFacetedMinMaxValues: getFacetedMinMaxValues(),
        debugHeaders: true,
        debugColumns: false,
    })

    const onPaginationChange = (page: number) => {
        table.setPageIndex(page - 1)
    }

    const onSelectChange = (value = 0) => {
        table.setPageSize(Number(value))
    }


const totalData=data.length;
console.log(data.length);

    return (
        <>
        <div className='flex flex-col sm:flex-row gap-5 justify-between mb-5'>
        <h3>Users</h3>
            <DebouncedInput
                value={globalFilter ?? ''}
                className="p-2 font-lg shadow border border-block"
                placeholder="Search ..."
                onChange={(value) => setGlobalFilter(String(value))}
            />
            </div>
            <Table>
                <THead>
                    {table.getHeaderGroups().map((headerGroup) => (
                        <Tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <Th
                                        key={header.id}
                                        colSpan={header.colSpan}
                                    >
                                        {header.isPlaceholder ? null : (
                                            <div
                                                {...{
                                                    className:
                                                        header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                    onClick:
                                                    header.column.id !== 'action' ? header.column.getToggleSortingHandler() : undefined,
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef
                                                        .header,
                                                    header.getContext()
                                                )}
                                                {
                                                    header.column.id !== 'action' && <Sorter
                                                    sort={header.column.getIsSorted()}
                                                />
                                                }
                                            </div>
                                        )}
                                    </Th>
                                )
                            })}
                        </Tr>
                    ))}
                </THead>
                <TBody>
                    {table.getRowModel().rows.map((row) => {
                        return (
                            <Tr key={row.id}>
                                {row.getVisibleCells().map((cell) => {
                                    return (
                                        <Td key={cell.id}>
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Td>
                                    )
                                })}
                            </Tr>
                        )
                    })}
                </TBody>
            </Table>
            <div className="flex items-center justify-between mt-4">
                <Pagination
                    pageSize={table.getState().pagination.pageSize}
                    currentPage={table.getState().pagination.pageIndex + 1}
                    total={totalData}
                    onChange={onPaginationChange}
                />
                <div style={{ minWidth: 130 }}>
                    <Select
                        size="sm"
                        isSearchable={false}
                        value={pageSizeOption.filter(
                            (option) =>
                                option.value ===
                                table.getState().pagination.pageSize
                        )}
                        options={pageSizeOption}
                        onChange={(option) => onSelectChange(option?.value)}
                    />
                </div>
            </div>
        </>
    )
}

export default Users

