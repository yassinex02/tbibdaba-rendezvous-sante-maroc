
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/components/ui/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Trash2, Save, Loader2 } from 'lucide-react';

interface MedicalCondition {
  id: string;
  name: string;
}

interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
}

interface MedicalInformationProps {
  userId: string;
  initialData?: {
    conditions: MedicalCondition[];
    medications: Medication[];
    allergies: string;
    bloodType: string;
    weight: string;
    height: string;
    notes: string;
  };
  onUpdate?: (data: any) => void;
}

const bloodTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

const commonConditions = [
  { id: 'diabetes', label: 'Diabète' },
  { id: 'hypertension', label: 'Hypertension' },
  { id: 'asthma', label: 'Asthme' },
  { id: 'heart_disease', label: 'Maladie cardiaque' },
  { id: 'arthritis', label: 'Arthrite' },
  { id: 'depression', label: 'Dépression' },
  { id: 'anxiety', label: 'Anxiété' },
  { id: 'cancer', label: 'Cancer' },
  { id: 'thyroid', label: 'Problèmes de thyroïde' }
];

const MedicalInformation = ({ userId, initialData, onUpdate }: MedicalInformationProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const defaultData = {
    conditions: [],
    medications: [],
    allergies: '',
    bloodType: '',
    weight: '',
    height: '',
    notes: ''
  };
  
  const [medicalData, setMedicalData] = useState(initialData || defaultData);
  const [newMedication, setNewMedication] = useState({ name: '', dosage: '', frequency: '' });
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  
  useEffect(() => {
    if (initialData) {
      setMedicalData(initialData);
      setSelectedConditions(initialData.conditions.map(c => c.id));
    }
  }, [initialData]);

  const handleConditionToggle = (conditionId: string, checked: boolean) => {
    if (checked) {
      const condition = commonConditions.find(c => c.id === conditionId);
      if (condition) {
        const newCondition = { id: conditionId, name: condition.label };
        setMedicalData({
          ...medicalData,
          conditions: [...medicalData.conditions, newCondition]
        });
        setSelectedConditions([...selectedConditions, conditionId]);
      }
    } else {
      setMedicalData({
        ...medicalData,
        conditions: medicalData.conditions.filter(c => c.id !== conditionId)
      });
      setSelectedConditions(selectedConditions.filter(id => id !== conditionId));
    }
  };

  const handleAddMedication = () => {
    if (newMedication.name && newMedication.dosage) {
      const medication = {
        ...newMedication,
        id: Date.now().toString()
      };
      
      setMedicalData({
        ...medicalData,
        medications: [...medicalData.medications, medication]
      });
      setNewMedication({ name: '', dosage: '', frequency: '' });
    }
  };

  const handleRemoveMedication = (id: string) => {
    setMedicalData({
      ...medicalData,
      medications: medicalData.medications.filter(med => med.id !== id)
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setMedicalData({ ...medicalData, [name]: value });
  };

  const handleMedicationChange = (field: string, value: string) => {
    setNewMedication({ ...newMedication, [field]: value });
  };

  const handleBloodTypeChange = (value: string) => {
    setMedicalData({ ...medicalData, bloodType: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (onUpdate) {
      onUpdate(medicalData);
    }
    
    toast({
      title: "Informations médicales mises à jour",
      description: "Vos informations ont été enregistrées avec succès."
    });
    
    setIsSaving(false);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <Loader2 className="h-8 w-8 text-tbibdaba-teal animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations médicales</CardTitle>
        <CardDescription>
          Ces informations aideront votre médecin à mieux comprendre votre état de santé
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-medium mb-3">Conditions médicales</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {commonConditions.map((condition) => (
                <div key={condition.id} className="flex items-center space-x-2">
                  <Checkbox 
                    id={`condition-${condition.id}`}
                    checked={selectedConditions.includes(condition.id)}
                    onCheckedChange={(checked) => 
                      handleConditionToggle(condition.id, checked as boolean)
                    }
                  />
                  <label
                    htmlFor={`condition-${condition.id}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {condition.label}
                  </label>
                </div>
              ))}
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Médicaments actuels</h3>
            <div className="space-y-4">
              {medicalData.medications.map((medication) => (
                <div key={medication.id} className="flex items-center gap-2 bg-gray-50 p-3 rounded-md">
                  <div className="flex-1">
                    <p className="font-medium">{medication.name}</p>
                    <p className="text-sm text-gray-500">
                      {medication.dosage} {medication.frequency ? `- ${medication.frequency}` : ''}
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveMedication(medication.id)}
                    aria-label="Supprimer ce médicament"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </Button>
                </div>
              ))}
              
              <div className="grid gap-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor="med-name">Nom du médicament</Label>
                    <Input
                      id="med-name"
                      value={newMedication.name}
                      onChange={(e) => handleMedicationChange('name', e.target.value)}
                      placeholder="Ex: Aspirine"
                    />
                  </div>
                  <div>
                    <Label htmlFor="med-dosage">Dosage</Label>
                    <Input
                      id="med-dosage"
                      value={newMedication.dosage}
                      onChange={(e) => handleMedicationChange('dosage', e.target.value)}
                      placeholder="Ex: 500mg"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="med-frequency">Fréquence (optionnel)</Label>
                  <Input
                    id="med-frequency"
                    value={newMedication.frequency}
                    onChange={(e) => handleMedicationChange('frequency', e.target.value)}
                    placeholder="Ex: 1 fois par jour"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto mt-1"
                  onClick={handleAddMedication}
                  disabled={!newMedication.name || !newMedication.dosage}
                >
                  <PlusCircle className="h-4 w-4 mr-2" />
                  Ajouter un médicament
                </Button>
              </div>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <h3 className="text-lg font-medium mb-3">Informations générales</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="bloodType">Groupe sanguin</Label>
                <Select
                  value={medicalData.bloodType}
                  onValueChange={handleBloodTypeChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {bloodTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="allergies">Allergies</Label>
                <Input
                  id="allergies"
                  name="allergies"
                  value={medicalData.allergies}
                  onChange={handleInputChange}
                  placeholder="Ex: Pénicilline, arachides..."
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="height">Taille (cm)</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  value={medicalData.height}
                  onChange={handleInputChange}
                  placeholder="Ex: 175"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="weight">Poids (kg)</Label>
                <Input
                  id="weight"
                  name="weight"
                  type="number"
                  value={medicalData.weight}
                  onChange={handleInputChange}
                  placeholder="Ex: 70"
                />
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes additionnelles</Label>
            <Textarea
              id="notes"
              name="notes"
              value={medicalData.notes}
              onChange={handleInputChange}
              placeholder="Autres informations importantes pour le médecin..."
              rows={4}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button type="button" variant="outline">
            Annuler
          </Button>
          <Button type="submit" disabled={isSaving}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Enregistrer
              </>
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
};

export default MedicalInformation;
