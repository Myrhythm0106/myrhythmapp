
import React from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Action } from "../types/goalTypes";
import { StatusBadge } from "./StatusBadge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { EventForm } from "../EventForm";

interface ActionTableProps {
  actions: Action[];
  goalId?: string;
}

export const ActionTable: React.FC<ActionTableProps> = ({ actions, goalId }) => {
  return (
    <div className="border rounded-md overflow-hidden mb-3">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px]">Action</TableHead>
            <TableHead>Date/Time</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {actions.map(action => (
            <TableRow key={action.id}>
              <TableCell className="font-medium">{action.title}</TableCell>
              <TableCell>{action.date} {action.startTime}</TableCell>
              <TableCell><StatusBadge status={action.status} /></TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">Edit</Button>
              </TableCell>
            </TableRow>
          ))}
          {goalId && (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="w-full" size="sm">
                      <Plus className="mr-1 h-3.5 w-3.5" />
                      Add action for this goal
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Add Action for Goal</DialogTitle>
                    </DialogHeader>
                    <EventForm goalId={goalId} />
                  </DialogContent>
                </Dialog>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};
