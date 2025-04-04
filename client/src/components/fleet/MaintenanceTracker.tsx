import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Wrench, AlertTriangle, Check, Plus, FileText, Calendar, Clock } from "lucide-react";

// Types for maintenance records
interface MaintenanceRecord {
  id: number;
  vehicleId: number;
  vehicleName: string;
  type: string;
  status: 'completed' | 'scheduled' | 'overdue';
  date: Date;
  cost?: number;
  description: string;
  technician?: string;
  notes?: string;
}

interface MaintenanceTrackerProps {
  records: MaintenanceRecord[];
  onAddRecord?: (record: Omit<MaintenanceRecord, 'id'>) => void;
  vehicles: Array<{ id: number, name: string }>;
}

export function MaintenanceTracker({ records, onAddRecord, vehicles }: MaintenanceTrackerProps) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [newRecord, setNewRecord] = useState<Partial<MaintenanceRecord>>({
    type: 'routine',
    status: 'scheduled',
    date: new Date(),
    description: '',
  });

  // Filter records into past and upcoming
  const pastRecords = records
    .filter(record => record.status === 'completed')
    .sort((a, b) => b.date.getTime() - a.date.getTime());
    
  const upcomingRecords = records
    .filter(record => record.status !== 'completed')
    .sort((a, b) => a.date.getTime() - b.date.getTime());
    
  const overdueRecords = upcomingRecords.filter(record => 
    record.status === 'overdue' || (record.date < new Date() && record.status !== 'completed')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddRecord && newRecord.vehicleId && newRecord.description) {
      onAddRecord(newRecord as Omit<MaintenanceRecord, 'id'>);
      setIsAddDialogOpen(false);
      setNewRecord({
        type: 'routine',
        status: 'scheduled',
        date: new Date(),
        description: '',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Maintenance Tracker</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Schedule Maintenance
            </Button>
          </DialogTrigger>
          <DialogContent>
            <form onSubmit={handleSubmit}>
              <DialogHeader>
                <DialogTitle>Schedule Maintenance</DialogTitle>
                <DialogDescription>
                  Add a new maintenance record or schedule upcoming maintenance.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="vehicle">Vehicle</Label>
                  <Select 
                    onValueChange={(value) => setNewRecord({...newRecord, vehicleId: parseInt(value)})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select vehicle" />
                    </SelectTrigger>
                    <SelectContent>
                      {vehicles.map(vehicle => (
                        <SelectItem key={vehicle.id} value={vehicle.id.toString()}>
                          {vehicle.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="type">Maintenance Type</Label>
                  <Select 
                    defaultValue="routine"
                    onValueChange={(value) => setNewRecord({...newRecord, type: value})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="routine">Routine Service</SelectItem>
                      <SelectItem value="repair">Repair</SelectItem>
                      <SelectItem value="inspection">Inspection</SelectItem>
                      <SelectItem value="emergency">Emergency Repair</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="date">Date</Label>
                  <Input 
                    id="date" 
                    type="date" 
                    onChange={(e) => setNewRecord({...newRecord, date: new Date(e.target.value)})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="status">Status</Label>
                  <Select 
                    defaultValue="scheduled"
                    onValueChange={(value) => setNewRecord({...newRecord, status: value as 'scheduled' | 'completed' | 'overdue'})}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Describe the maintenance to be performed"
                    onChange={(e) => setNewRecord({...newRecord, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="technician">Technician (Optional)</Label>
                  <Input 
                    id="technician" 
                    onChange={(e) => setNewRecord({...newRecord, technician: e.target.value})}
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="cost">Estimated Cost (Optional)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    onChange={(e) => setNewRecord({...newRecord, cost: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Schedule</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {overdueRecords.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Overdue Maintenance</AlertTitle>
          <AlertDescription>
            There are {overdueRecords.length} maintenance tasks that are overdue or past their scheduled date.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="h-5 w-5 mr-2 text-primary" />
              Upcoming Maintenance
            </CardTitle>
            <CardDescription>Scheduled maintenance and service</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {upcomingRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.vehicleName}</TableCell>
                      <TableCell>{record.type}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
                          {record.date.toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={record.status === 'overdue' || record.date < new Date() ? 'destructive' : 'outline'}
                        >
                          {record.status === 'overdue' || record.date < new Date() ? 'Overdue' : 'Scheduled'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No upcoming maintenance scheduled
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Wrench className="h-5 w-5 mr-2 text-primary" />
              Maintenance History
            </CardTitle>
            <CardDescription>Previous service and repairs</CardDescription>
          </CardHeader>
          <CardContent>
            {pastRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Service</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pastRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell className="font-medium">{record.vehicleName}</TableCell>
                      <TableCell>{record.description}</TableCell>
                      <TableCell>{record.date.toLocaleDateString()}</TableCell>
                      <TableCell>{record.cost ? `$${record.cost.toLocaleString()}` : 'N/A'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No maintenance history available
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="h-5 w-5 mr-2 text-primary" />
            Maintenance Schedule Overview
          </CardTitle>
          <CardDescription>Timeline of all scheduled maintenance activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-0 top-0 bottom-0 w-0.5 bg-gray-200 ml-3.5 dark:bg-gray-800"></div>
            {upcomingRecords.length > 0 ? (
              <div className="space-y-6">
                {upcomingRecords.map((record, index) => (
                  <div key={record.id} className="relative pl-10">
                    <div className="absolute left-0 top-1.5 w-7 h-7 rounded-full bg-primary flex items-center justify-center">
                      <Wrench className="h-4 w-4 text-primary-foreground" />
                    </div>
                    <div className="p-4 border rounded-md shadow-sm">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-medium">{record.vehicleName}</h3>
                        <Badge 
                          variant={record.status === 'overdue' || record.date < new Date() ? 'destructive' : 'outline'}
                        >
                          {record.status === 'overdue' || record.date < new Date() ? 'Overdue' : 'Scheduled'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        <span className="inline-flex items-center mr-3">
                          <CalendarIcon className="h-3.5 w-3.5 mr-1" />
                          {record.date.toLocaleDateString()}
                        </span>
                        <span className="inline-flex items-center">
                          <FileText className="h-3.5 w-3.5 mr-1" />
                          {record.type}
                        </span>
                      </p>
                      <p className="text-sm">{record.description}</p>
                      {record.technician && (
                        <p className="text-xs text-muted-foreground mt-2">Technician: {record.technician}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                No maintenance activities scheduled
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button variant="outline" size="sm">
            <FileText className="h-4 w-4 mr-2" />
            Export Schedule
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
} 