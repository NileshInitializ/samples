import { useState, useCallback } from 'react'
import { useAppSelector } from '../store'

const CurrentSubscription = () => {
    const [subscribed, setSubscribed] = useState(true)

    const data = useAppSelector(
        (state) => state.crmCustomerDetails.data.subscriptionData
    )

    const unsubscribe = useCallback(() => {
        setSubscribed(false)
    }, [])

    const subscribe = useCallback(() => {
        setSubscribed(true)
    }, [])


    <TBody>
          {data.map((item) => [
            <Tr key={item.id}>
              <Td className="px-4"onClick={() => toggleRow(item.id)}>
                
                  {expandedRow === item.mom_id? <HiOutlineChevronDown /> : <HiOutlineChevronRight />}
              
              </Td>
              <Td className="px-4">{item.mom_id}</Td>
              <Td className="px-4">{item.source}</Td>
            </Tr>,
            
            expandedRow === item.id && (
            <Tr>
              <Td>
              <div key={`details-${item.id}`}>
                <h1>Meeting date: {item.meetingdate}</h1>
                <p>fghjkl;lkjhgfdsfghjklkjhgfdfghjk;kjhgfdsdfghjklljhgfddkjhgfddfghjklkjhgfd</p>
              </div>
              </Td>
              </Tr>
            ),
          ])}
          
        </TBody>

    return (
        <div className="mb-8">
            <h6 className="mb-4">Subscription</h6>
            {data.map((sub) => (
                <Card key={sub.plan} bordered className="mb-4">
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div>
                                <Avatar
                                    className="bg-emerald-500"
                                    shape="circle"
                                    icon={<HiFire />}
                                ></Avatar>
                            </div>
                            <div>
                                <div className="flex items-center">
                                    <h6>{sub.plan}</h6>
                                    <Tag className="bg-emerald-100 text-emerald-600 dark:bg-emerald-500/20 dark:text-emerald-100 rounded-md border-0 mx-2">
                                        <span className="capitalize">
                                            {sub.status}
                                        </span>
                                    </Tag>
                                </div>
                                <div>
                                    <span>Billing {sub.billing}</span>
                                    <span> | </span>
                                    <span>
                                        Next payment on{' '}
                                        {dayjs
                                            .unix(sub.nextPaymentDate)
                                            .format('MM/DD/YYYY')}
                                    </span>
                                    <span>
                                        <span className="mx-1">for</span>
                                        <NumericFormat
                                            className="font-semibold text-gray-900 dark:text-gray-100"
                                            displayType="text"
                                            value={(
                                                Math.round(sub.amount * 100) /
                                                100
                                            ).toFixed(2)}
                                            prefix={'$'}
                                            thousandSeparator={true}
                                        />
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="flex">
                            {subscribed && (
                                <Button
                                    size="sm"
                                    variant="plain"
                                    onClick={unsubscribe}
                                >
                                    Cancel plan
                                </Button>
                            )}
                            <Button
                                size="sm"
                                className="ml-2 rtl:mr-2"
                                onClick={subscribe}
                            >
                                {subscribed ? 'Update' : 'Subscribe'} Plan
                            </Button>
                        </div>
                    </div>
                </Card>
            ))}
        </div>
    )
}

export default CurrentSubscription
