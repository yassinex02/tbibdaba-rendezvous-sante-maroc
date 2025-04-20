
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';

interface MedicalData {
  chronicConditions: {
    id: string;
    label: string;
    checked: boolean;
  }[];
  medications: string[];
  allergies: string;
  bloodType: string;
  emergencyContact: {
    name: string;
    relationship: string;
    phone: string;
  };
}

const defaultMedicalData: MedicalData = {
  chronicConditions: [
    { id: 'diabetes', label: 'Diabète', checked: false },
    { id: 'hypertension', label: 'Hypertension', checked: false },
    { id: 'asthma', label: 'Asthme', checked: false },
    { id: 'heart-disease', label: 'Maladie cardiaque', checked: false },
    { id: 'arthritis', label: 'Arthrite', checked: false },
    { id: 'cancer', label: 'Cancer', checked: false },
    { id: 'thyroid', label: 'Problèmes de thyroïde', checked: false }
  ],
  medications: [],
  allergies: '',
  bloodType: '',
  emergencyContact: {
    name: '',
    relationship: '',
    phone: ''
  }
};

const MedicalInformation = () => {
  const [medicalData, setMedicalData] = useState<MedicalData>(defaultMedicalData);
  const [newMedication, setNewMedication] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();

  // Load from localStorage on mount
  useEffect(() => {
    const savedData = localStorage.getItem('patientMedicalData');
    if (savedData) {
      setMedicalData(JSON.parse(savedData));
    }
  }, []);

  const toggleCondition = (id: string) => {
    setMedicalData(prev => ({
      ...prev,
      chronicConditions: prev.chronicConditions.map(condition =>
        condition.id === id
          ? { ...condition, checked: !condition.checked }
          : condition
      )
    }));
  };

  const addMedication = () => {
    if (newMedication.trim()) {
      setMedicalData(prev => ({
        ...prev,
        medications: [...prev.medications, newMedication.trim()]
      }));
      setNewMedication('');
    }
  };

  const removeMedication = (index: number) => {
    setMedicalData(prev => ({
      ...prev,
      medications: prev.medications.filter((_, i) => i !== index)
    }));
  };

  const handleInputChange = (
    field: keyof Omit<MedicalData, 'chronicConditions' | 'medications' | 'emergencyContact'>,
    value: string
  ) => {
    setMedicalData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleEmergencyContactChange = (
    field: keyof MedicalData['emergencyContact'],
    value: string
  ) => {
    setMedicalData(prev => ({
      ...prev,
      emergencyContact: {
        ...prev.emergencyContact,
        [field]: value
      }
    }));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API call
    setTimeout(() => {
      // Save to localStorage
      localStorage.setItem('patientMedicalData', JSON.stringify(medicalData));
      
      toast({
        title: "Informations médicales enregistrées",
        description: "Vos informations médicales ont été mises à jour",
      });
      
      setIsSaving(false);
    }, 500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informations médicales</CardTitle>
        <CardDescription>
          Ces informations aideront vos médecins à vous fournir de meilleurs soins
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Chronic Conditions */}
        <div>
          <h3 className="text-sm font-medium mb-3">Conditions chroniques</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {medicalData.chronicConditions.map(condition => (
              <div key={condition.id} className="flex items-center space-x-2">
                <Checkbox
                  id={condition.id}
                  checked={condition.checked}
                  onCheckedChange={() => toggleCondition(condition.id)}
                />
                <Label htmlFor={condition.id} className="text-sm">
                  {condition.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Blood Type */}
        <div>
          <Label htmlFor="blood-type" className="text-sm font-medium">
            Groupe sanguin
          </Label>
          <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mt-2">
            {['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'].map(type => (
              <Button
                key={type}
                type="button"
                variant={medicalData.bloodType === type ? "default" : "outline"}
                onClick={() => handleInputChange('bloodType', type)}
                className={`text-sm py-1 ${medicalData.bloodType === type ? 'bg-tbibdaba-teal hover:bg-tbibdaba-teal/90' : ''}`}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
        
        {/* Medications */}
        <div>
          <Label htmlFor="medications" className="text-sm font-medium">
            Médicaments actuels
          </Label>
          <div className="flex mt-2">
            <Input
              id="medications"
              placeholder="Ajouter un médicament"
              value={newMedication}
              onChange={(e) => setNewMedication(e.target.value)}
              className="flex-1 mr-2"
            />
            <Button 
              type="button" 
              onClick={addMedication}
              disabled={!newMedication.trim()}
            >
              Ajouter
            </Button>
          </div>
          
          {medicalData.medications.length > 0 && (
            <div className="mt-3 space-y-2">
              {medicalData.medications.map((medication, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span>{medication}</span>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => removeMedication(index)}
                    className="h-8 w-8 p-0"
                  >
                    ✕
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Allergies */}
        <div>
          <Label htmlFor="allergies" className="text-sm font-medium">
            Allergies et réactions
          </Label>
          <Textarea
            id="allergies"
            placeholder="Énumérez vos allergies et décrivez vos réactions"
            value={medicalData.allergies}
            onChange={(e) => handleInputChange('allergies', e.target.value)}
            className="mt-2"
          />
        </div>
        
        {/* Emergency Contact */}
        <div>
          <h3 className="text-sm font-medium mb-3">Contact d'urgence</h3>
          <div className="grid gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="emergency-name" className="text-sm">
                  Nom complet
                </Label>
                <Input
                  id="emergency-name"
                  value={medicalData.emergencyContact.name}
                  onChange={(e) => handleEmergencyContactChange('name', e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergency-relationship" className="text-sm">
                  Relation
                </Label>
                <Input
                  id="emergency-relationship"
                  value={medicalData.emergencyContact.relationship}
                  onChange={(e) => handleEmergencyContactChange('relationship', e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="emergency-phone" className="text-sm">
                Numéro de téléphone
              </Label>
              <Input
                id="emergency-phone"
                type="tel"
                value={medicalData.emergencyContact.phone}
                onChange={(e) => handleEmergencyContactChange('phone', e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="bg-tbibdaba-teal hover:bg-tbibdaba-teal/90"
        >
          {isSaving ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MedicalInformation;
