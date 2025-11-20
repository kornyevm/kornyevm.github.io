import {ButtonGroup} from "@/components/ui/button-group.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useState} from "react";

export enum LayoutMode {
  Vertical = "Vertical",
  Compact = "Compact",
  Free = "Free",
}

function LayoutModeSwitch() {
  const [selectedMode, setSelectedMode] = useState<LayoutMode>(LayoutMode.Vertical)

  return (
    <>
      <ButtonGroup>
        <Button onClick={() => setSelectedMode(LayoutMode.Vertical)} variant={ selectedMode == LayoutMode.Vertical ? 'default' : 'outline' }>Vertical</Button>
        <Button onClick={() => setSelectedMode(LayoutMode.Compact)} variant={ selectedMode == LayoutMode.Compact ? 'default' : 'outline' }>Compact</Button>
        <Button onClick={() => setSelectedMode(LayoutMode.Free)} variant={ selectedMode == LayoutMode.Free ? 'default' : 'outline' }>Free</Button>
      </ButtonGroup>
    </>
  )
}

export default LayoutModeSwitch
