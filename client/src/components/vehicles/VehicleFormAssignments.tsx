import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface VehicleFormAssignmentsProps {
  formData: any;
  setFormData: (data: any) => void;
}

export function VehicleFormAssignments({ formData, setFormData }: VehicleFormAssignmentsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="assignedDriver">Assigned Driver</Label>
          <Input
            id="assignedDriver"
            value={formData.assignedDriver}
            onChange={(e) => setFormData({ ...formData, assignedDriver: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="routeAssignment">Route Assignment</Label>
          <Input
            id="routeAssignment"
            value={formData.routeAssignment}
            onChange={(e) => setFormData({ ...formData, routeAssignment: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fuelCardNumber">Fuel Card Number</Label>
          <Input
            id="fuelCardNumber"
            value={formData.fuelCardNumber}
            onChange={(e) => setFormData({ ...formData, fuelCardNumber: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tollTagId">Toll Tag ID</Label>
          <Input
            id="tollTagId"
            value={formData.tollTagId}
            onChange={(e) => setFormData({ ...formData, tollTagId: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="routingPreference">Routing Preference</Label>
          <Select
            value={formData.routingPreference}
            onValueChange={(value) => setFormData({ ...formData, routingPreference: value })}
          >
            <SelectTrigger id="routingPreference">
              <SelectValue placeholder="Select routing preference" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="standard">Standard</SelectItem>
              <SelectItem value="fastest">Fastest</SelectItem>
              <SelectItem value="fuel-efficient">Fuel Efficient</SelectItem>
              <SelectItem value="avoid-tolls">Avoid Tolls</SelectItem>
              <SelectItem value="avoid-highways">Avoid Highways</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="utilizationTarget">Utilization Target (%)</Label>
          <Input
            id="utilizationTarget"
            type="number"
            min="0"
            max="100"
            value={formData.utilizationTarget}
            onChange={(e) => setFormData({ ...formData, utilizationTarget: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="dailyRate">Daily Rate ($)</Label>
          <Input
            id="dailyRate"
            type="number"
            min="0"
            value={formData.dailyRate}
            onChange={(e) => setFormData({ ...formData, dailyRate: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
} 