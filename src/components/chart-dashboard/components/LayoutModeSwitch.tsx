import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {LayoutMode} from "@/components/chart-dashboard/ChartDashboard.tsx";
import {CircleQuestionMark} from "lucide-react";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";

type LayoutModeSwitchProps = {
  mode: LayoutMode
  updateMode: (mode: LayoutMode) => void
}

function LayoutModeSwitch({ mode, updateMode }: LayoutModeSwitchProps) {

  return (
    <>
      {/*TODO: Just use a loop*/}
      <ButtonGroup>
        <Button
          onClick={() => updateMode(LayoutMode.Vertical)}
          variant={ mode === LayoutMode.Vertical ? 'default' : 'outline' }
        >
          Vertical
        </Button>
        <Button
          onClick={() => updateMode(LayoutMode.Compact)}
          variant={ mode === LayoutMode.Compact ? 'default' : 'outline' }
        >
          Grid
        </Button>
        <Button
          onClick={() => updateMode(LayoutMode.Free)}
          variant={ mode === LayoutMode.Free ? 'default' : 'outline' }
        >
          Custom
        </Button>
      </ButtonGroup>

      {
        mode === LayoutMode.Free && (
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="ghost" size="icon" className='rounded-full ml-1'>
                <CircleQuestionMark />
              </Button>
            </PopoverTrigger>
            <PopoverContent side='bottom' className="w-80">
                <p className='text-sm'>
                  In Custom layout mode, you can freely position / scale your data using the handles in the bottom right-hand corner of each chart.
                  <br /><br />
                  Don't worry! Your changes will be auto-saved.
                </p>
            </PopoverContent>
          </Popover>
        )
      }
    </>
  )
}

export default LayoutModeSwitch
