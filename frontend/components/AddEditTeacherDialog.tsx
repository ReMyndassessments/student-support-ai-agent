import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import backend from '~backend/client';
import type { UserProfile } from '~backend/users/get-profile';

interface AddEditTeacherDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (teacher: UserProfile) => void;
  teacher?: UserProfile | null;
}

export function AddEditTeacherDialog({ isOpen, onClose, onSave, teacher }: AddEditTeacherDialogProps) {
  const [formData, setFormData] = useState({
    email: '',
    name: '',
    schoolName: '',
    schoolDistrict: '',
    teacherType: 'classroom',
    subscriptionEndDate: '',
    supportRequestsLimit: 20,
  });
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (teacher) {
      setFormData({
        email: teacher.email,
        name: teacher.name || '',
        schoolName: teacher.schoolName || '',
        schoolDistrict: teacher.schoolDistrict || '',
        teacherType: teacher.teacherType || 'classroom',
        subscriptionEndDate: teacher.subscriptionEndDate ? new Date(teacher.subscriptionEndDate).toISOString().split('T')[0] : '',
        supportRequestsLimit: teacher.supportRequestsLimit,
      });
    } else {
      // Reset form for adding a new teacher
      const oneYearFromNow = new Date();
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1);
      setFormData({
        email: '',
        name: '',
        schoolName: '',
        schoolDistrict: '',
        teacherType: 'classroom',
        subscriptionEndDate: oneYearFromNow.toISOString().split('T')[0],
        supportRequestsLimit: 20,
      });
    }
  }, [teacher, isOpen]);

  const handleSave = async () => {
    if (!formData.email || !formData.name) {
      toast({
        title: "Missing Fields",
        description: "Email and Name are required.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      let savedTeacher;
      if (teacher) {
        // Update existing teacher
        savedTeacher = await backend.users.updateUserByAdmin({
          id: teacher.id,
          ...formData,
          supportRequestsLimit: Number(formData.supportRequestsLimit),
        });
      } else {
        // Create new teacher
        savedTeacher = await backend.users.createUserByAdmin({
          ...formData,
          supportRequestsLimit: Number(formData.supportRequestsLimit),
        });
      }
      onSave(savedTeacher);
      toast({
        title: `Teacher ${teacher ? 'Updated' : 'Added'}`,
        description: `${savedTeacher.name} has been successfully saved.`,
      });
      onClose();
    } catch (error) {
      console.error('Error saving teacher:', error);
      const errorMessage = error instanceof Error ? error.message : "An unknown error occurred.";
      toast({
        title: "Save Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg rounded-3xl">
        <DialogHeader>
          <DialogTitle>{teacher ? 'Edit Teacher' : 'Add New Teacher'}</DialogTitle>
          <DialogDescription>
            {teacher ? `Update the details for ${teacher.name}.` : 'Enter the details for the new teacher.'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">Name</Label>
            <Input id="name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">Email</Label>
            <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schoolName" className="text-right">School</Label>
            <Input id="schoolName" value={formData.schoolName} onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="schoolDistrict" className="text-right">District</Label>
            <Input id="schoolDistrict" value={formData.schoolDistrict} onChange={(e) => setFormData({ ...formData, schoolDistrict: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="teacherType" className="text-right">Type</Label>
            <Select value={formData.teacherType} onValueChange={(value) => setFormData({ ...formData, teacherType: value })}>
              <SelectTrigger className="col-span-3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="classroom">Classroom Teacher</SelectItem>
                <SelectItem value="specialist">Specialist</SelectItem>
                <SelectItem value="support">Support Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="subscriptionEndDate" className="text-right">Sub. End</Label>
            <Input id="subscriptionEndDate" type="date" value={formData.subscriptionEndDate} onChange={(e) => setFormData({ ...formData, subscriptionEndDate: e.target.value })} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="supportRequestsLimit" className="text-right">Limit</Label>
            <Input id="supportRequestsLimit" type="number" value={formData.supportRequestsLimit} onChange={(e) => setFormData({ ...formData, supportRequestsLimit: Number(e.target.value) })} className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
