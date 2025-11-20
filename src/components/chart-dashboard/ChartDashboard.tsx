import DateRangePicker from "@/components/chart-dashboard/components/DateRangePicker.tsx";
import LayoutModeSwitch from "@/components/chart-dashboard/components/LayoutModeSwitch.tsx";
import {Card, CardContent} from "@/components/ui/card.tsx";

function ChartDashboard() {
  return (
    <>
      {/*TITLE*/}
      {/*<div className='text-center text-3xl mb-3'>*/}
      {/*  Docker Analytics*/}
      {/*</div>*/}

      <Card className="w-full">
        <CardContent className='p-4 flex'>
          <LayoutModeSwitch />
          <DateRangePicker className='ml-auto' />
        </CardContent>
      </Card>
    </>
  )
}

export default ChartDashboard
