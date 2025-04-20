
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Save, Loader2 } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

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
  patientId: string;
}

const MedicalInformation = ({ patientId }: MedicalInformationProps) => {
  const [isSaving, setIsSaving] = useState(false);
  
  // Common medical conditions
  const commonConditions: MedicalCondition[] = [
    { id: 'diabetes', name: 'Diabète' },
    { id: 'hypertension', name: 'Hypertension' },
    { id: 'asthma', name: 'Asthme' },
    { id: 'heartDisease', name: 'Maladie cardiaque' },
    { id: 'arthritis', name: 'Arthrite' },
    { id: 'cancer', name: 'Cancer' },
    { id: 'depression', name: 'Dépression' },
    { id: 'thyroid', name: 'Problèmes de thyroïde' },
  ];
  
  const [medicalData, setMedicalData] = useState({
    conditions: [] as string[],
    otherConditions: '',
    medications: [] as Medication[],
    allergies: '',
    bloodType: '',
    height: '',
    weight: '',
    emergencyContact: {
      name: '',
      phone: '',
      relationship: '',
    },
  });
  
  const [newMedication, setNewMedication] = useState({
    name: '',
    dosage: '',
    frequency: '',
  });
  
  const handleConditionChange = (condition: string, checked: boolean) => {
    if (checked) {
      setMedicalData(prev => ({
        ...prev,
        conditions: [...prev.conditions, condition],
      }));
    } else {
      setMedicalData(prev => ({
        ...prev,
        conditions: prev.conditions.filter(c => c !== condition),
      }));
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested fields
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setMedicalData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent as keyof typeof prev],
          [child]: value,
        },
      }));
    } else {
      setMedicalData(prev => ({
        ...prev,
        [name]: value,
      }));
    }
  };
  
  const handleNewMedicationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const addMedication = () => {
    if (!newMedication.name) return;
    
    const medication: Medication = {
      id: `med-${Date.now()}`,
      ...newMedication,
    };
    
    setMedicalData(prev => ({
      ...prev,
      medications: [...prev.medications, medication],
    }));
    
    // Reset form
    setNewMedication({
      name: '',
      dosage: '',
      frequency: '',
    });
  };
  
  const removeMedication = (id: string) => {
    setMedicalData(prev => ({
      ...prev,
      medications: prev.medications.filter(med => med.id !== id),
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    // In a real app, this would send data to an API
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    console.log('Medical data saved:', medicalData);
    
    toast({
      title: "Informations médicales enregistrées",
      description: "Vos informations médicales ont été mises à jour avec succès.",
    });
    
    setIsSaving(false);
  };
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations médicales</CardTitle>
        <CardDescription>
          Ces informations seront partagées avec les médecins lors de vos rendez-vous
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit}>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium mb-4">Conditions médicales chroniques</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {commonConditions.map(condition => (
                  <div key={condition.id} className="flex items-center space-x-2">
                    <Checkbox 
                      id={condition.id}
                      checked={medicalData.conditions.includes(condition.id)}
                      onCheckedChange={checked => 
                        handleConditionChange(condition.id, checked as boolean)
                      }
                      aria-label={condition.name}
                    />
                    <label
                      htmlFor={condition.id}
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {condition.name}
                    </label>
                  </div>
                ))}
              </div>
              
              <div className="mt-4">
                <Label htmlFor="otherConditions">Autres conditions</Label>
                <Textarea
                  id="otherConditions"
                  name="otherConditions"
                  placeholder="Listez d'autres conditions médicales si nécessaire"
                  value={medicalData.otherConditions}
                  onChange={handleInputChange}
                  rows={3}
                  aria-label="Autres conditions médicales"
                />
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Médicaments actuels</h3>
              
              {medicalData.medications.length > 0 && (
                <div className="space-y-3 mb-4">
                  {medicalData.medications.map((med) => (
                    <div key={med.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-md">
                      <div>
                        <div className="font-medium">{med.name}</div>
                        <div className="text-sm text-gray-500">
                          {med.dosage} - {med.frequency}
                        </div>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMedication(med.id)}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        aria-label={`Supprimer ${med.name}`}
                      >
                        ✕
                      </Button>
                    </div>
                  ))}
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="name">Médicament</Label>
                  <Input
                    id="name"
                    name="name"
                    value={newMedication.name}
                    onChange={handleNewMedicationChange}
                    placeholder="Nom du médicament"
                    aria-label="Nom du médicament"
                  />
                </div>
                <div>
                  <Label htmlFor="dosage">Dosage</Label>
                  <Input
                    id="dosage"
                    name="dosage"
                    value={newMedication.dosage}
                    onChange={handleNewMedicationChange}
                    placeholder="ex: 500mg"
                    aria-label="Dosage du médicament"
                  />
                </div>
                <div>
                  <Label htmlFor="frequency">Fréquence</Label>
                  <Input
                    id="frequency"
                    name="frequency"
                    value={newMedication.frequency}
                    onChange={handleNewMedicationChange}
                    placeholder="ex: 2 fois par jour"
                    aria-label="Fréquence de prise"
                  />
                </div>
              </div>
              
              <Button
                type="button"
                variant="outline"
                className="mt-3"
                onClick={addMedication}
                disabled={!newMedication.name}
                aria-label="Ajouter un médicament"
              >
                + Ajouter un médicament
              </Button>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Allergies</h3>
              <Textarea
                id="allergies"
                name="allergies"
                placeholder="Listez vos allergies connues (médicaments, aliments, etc.)"
                value={medicalData.allergies}
                onChange={handleInputChange}
                rows={3}
                aria-label="Allergies connues"
              />
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Informations générales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="bloodType">Groupe sanguin</Label>
                  <Input
                    id="bloodType"
                    name="bloodType"
                    value={medicalData.bloodType}
                    onChange={handleInputChange}
                    placeholder="ex: A+"
                    aria-label="Groupe sanguin"
                  />
                </div>
                <div>
                  <Label htmlFor="height">Taille (cm)</Label>
                  <Input
                    id="height"
                    name="height"
                    type="number"
                    value={medicalData.height}
                    onChange={handleInputChange}
                    placeholder="170"
                    aria-label="Taille en centimètres"
                  />
                </div>
                <div>
                  <Label htmlFor="weight">Poids (kg)</Label>
                  <Input
                    id="weight"
                    name="weight"
                    type="number"
                    value={medicalData.weight}
                    onChange={handleInputChange}
                    placeholder="70"
                    aria-label="Poids en kilogrammes"
                  />
                </div>
              </div>
            </div>
            
            <div className="border-t pt-6">
              <h3 className="text-lg font-medium mb-4">Contact d'urgence</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="emergencyName">Nom</Label>
                  <Input
                    id="emergencyName"
                    name="emergencyContact.name"
                    value={medicalData.emergencyContact.name}
                    onChange={handleInputChange}
                    placeholder="Nom du contact"
                    aria-label="Nom du contact d'urgence"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyPhone">Téléphone</Label>
                  <Input
                    id="emergencyPhone"
                    name="emergencyContact.phone"
                    value={medicalData.emergencyContact.phone}
                    onChange={handleInputChange}
                    placeholder="+212 6XX XXXXXX"
                    aria-label="Téléphone du contact d'urgence"
                  />
                </div>
                <div>
                  <Label htmlFor="emergencyRelationship">Relation</Label>
                  <Input
                    id="emergencyRelationship"
                    name="emergencyContact.relationship"
                    value={medicalData.emergencyContact.relationship}
                    onChange={handleInputChange}
                    placeholder="ex: Conjoint, Parent"
                    aria-label="Relation avec le contact d'urgence"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter>
        <Button
          type="submit"
          onClick={handleSubmit}
          disabled={isSaving}
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90 ml-auto"
          aria-label="Enregistrer les informations médicales"
        >
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
    </Card>
  );
};

export default MedicalInformation;
