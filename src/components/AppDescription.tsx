import {Alert, AlertDescription, AlertTitle} from "@/components/ui/alert.tsx";
import {Lightbulb, SquareArrowOutUpRight, X} from "lucide-react";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

const DESIGN_DOC_URL = "https://mini-porter-22f.notion.site/Blacksmith-Data-Dashboard-2b15a7171c3b80ff9ff7fba5c885349a"
const SOURCE_URL = "https://github.com/kornyevm/analytics-dash"

export default function AppDescriptionAlert() {
  const [showAlert, setShowAlert] = useState<boolean>(true)

  const openInNewTab = (url: string) => {
    const newWindow = window.open(url, '_blank', 'noopener,noreferrer');
    if (newWindow) newWindow.focus();
  }

  return (
    <>
      { showAlert &&
        <Alert>
          <Lightbulb className='stroke-yellow-400' />
          <AlertTitle>Dont forget to check out the supporting resources!</AlertTitle>
          <AlertDescription>
            I built this nifty dashboard to demo my React skills and project management methodology.
            Try out the grid layout + LocalStorage persistence in Custom Mode!
            <div className='flex mt-2'>
              <Button variant='outline' size='xs' className='text-xs mr-1 !px-4' onClick={() => { openInNewTab(DESIGN_DOC_URL) }}>
                Design Doc <SquareArrowOutUpRight className='!w-3 !h-3' />
              </Button>
              <Button variant='outline' size='xs' className='text-xs mr-1 !px-4' onClick={() => { openInNewTab(SOURCE_URL) }}>
                Source <SquareArrowOutUpRight className='!w-3 !h-3' />
              </Button>
              <Button size='xs' className='text-xs !px-2' onClick={() => setShowAlert(false)}>
                Dismiss <X className='!w-3 !h-3' />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      }
    </>
  )
}