import { TiPlus } from "react-icons/ti";

import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";

export const TaskViewSwitcher = () => {
  return (
    <Tabs className="w-full flex-1 border rounded-lg">
      <div className="h-full flex flex-col overflow-auto p-4">
        <div className="flex flex-col gap-y-2 lg:flex-row items-center justify-between">
          <TabsList className="w-full lg:w-auto">
            <TabsTrigger className="w-full h-8 lg:w-auto" value="table">Table</TabsTrigger>
            <TabsTrigger className="w-full h-8 lg:w-auto" value="kanban">Kanban</TabsTrigger>
            <TabsTrigger className="w-full h-8 lg:w-auto" value="calendar">Calendar</TabsTrigger>
          </TabsList>
          <Button className="w-full lg:w-auto" size="xs"><TiPlus className="size-4 mr-2" />New</Button>
        </div>
        <Separator className="my-4" />
        <h3 className="w-full text-center">Data Filters</h3>
        <Separator className="my-4" />
        <>
          <TabsContent value="table" className="mt-0">
            Data Table
          </TabsContent>
          <TabsContent value="kanban" className="mt-0">
            Data Kanban
          </TabsContent>
          <TabsContent value="calendar" className="mt-0">
            Data Calendar
          </TabsContent>
        </>
      </div>
    </Tabs>
  );
};
