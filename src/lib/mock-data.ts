
export const specialties = [
  'Cardiologie',
  'Dermatologie',
  'Endocrinologie',
  'Gastro-entérologie',
  'Gynécologie',
  'Médecine générale',
  'Neurologie',
  'Ophtalmologie',
  'ORL',
  'Orthopédie',
  'Pédiatrie',
  'Psychiatrie',
  'Radiologie',
  'Rhumatologie',
  'Urologie'
];

export const cities = [
  'Casablanca',
  'Rabat',
  'Marrakech',
  'Fès',
  'Tanger',
  'Agadir',
  'Meknès',
  'Oujda',
  'Kénitra',
  'Tétouan'
];

export const doctors = [
  {
    id: '1',
    name: 'Dr. Yasmine Benali',
    specialty: 'Cardiologie',
    city: 'Casablanca',
    address: '123 Avenue Hassan II, Casablanca',
    phone: '+212 522 123456',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    rating: 4.8,
    reviewCount: 124,
    about: "Cardiologue spécialisée dans le diagnostic et le traitement des maladies cardiovasculaires. Plus de 15 ans d'expérience.",
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Casablanca', year: '2005' },
      { degree: 'Spécialisation en Cardiologie', institution: 'CHU Ibn Sina, Rabat', year: '2010' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00']
  },
  {
    id: '2',
    name: 'Dr. Omar Kadiri',
    specialty: 'Pédiatrie',
    city: 'Rabat',
    address: '45 Avenue Mohammed V, Rabat',
    phone: '+212 537 234567',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.9,
    reviewCount: 98,
    about: "Pédiatre avec expertise particulière dans les soins aux nouveau-nés et le développement de l'enfant. Approche chaleureuse et attentive.",
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Rabat', year: '2008' },
      { degree: 'Spécialisation en Pédiatrie', institution: 'Hôpital d\'Enfants, Rabat', year: '2013' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Jeudi', 'Samedi'],
    timeSlots: ['09:30', '10:30', '11:30', '15:00', '16:00', '17:00']
  },
  {
    id: '3',
    name: 'Dr. Fatima Alaoui',
    specialty: 'Dermatologie',
    city: 'Marrakech',
    address: '78 Rue Ibn Tofail, Guéliz, Marrakech',
    phone: '+212 524 345678',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.7,
    reviewCount: 87,
    about: "Dermatologue spécialisée dans les affections cutanées et les traitements esthétiques. Approche holistique combinant médecine conventionnelle et naturelle.",
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Marrakech', year: '2009' },
      { degree: 'Spécialisation en Dermatologie', institution: 'CHU Mohammed VI, Marrakech', year: '2014' }
    ],
    availableDays: ['Mardi', 'Mercredi', 'Vendredi', 'Samedi'],
    timeSlots: ['10:00', '11:00', '12:00', '14:30', '15:30', '16:30']
  },
  {
    id: '4',
    name: 'Dr. Karim Tazi',
    specialty: 'Orthopédie',
    city: 'Casablanca',
    address: '256 Boulevard Zerktouni, Casablanca',
    phone: '+212 522 456789',
    image: 'https://randomuser.me/api/portraits/men/45.jpg',
    rating: 4.6,
    reviewCount: 76,
    about: "Chirurgien orthopédiste spécialisé dans les traumatismes sportifs et les chirurgies de remplacement articulaire. Approche mini-invasive.",
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Casablanca', year: '2007' },
      { degree: 'Spécialisation en Chirurgie Orthopédique', institution: 'CHU Ibn Rochd, Casablanca', year: '2013' }
    ],
    availableDays: ['Lundi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeSlots: ['08:00', '09:00', '10:00', '14:00', '15:00', '16:00']
  },
  {
    id: '5',
    name: 'Dr. Nadia Mansouri',
    specialty: 'Gynécologie',
    city: 'Rabat',
    address: '189 Avenue Hassan II, Rabat',
    phone: '+212 537 567890',
    image: 'https://randomuser.me/api/portraits/women/29.jpg',
    rating: 4.9,
    reviewCount: 112,
    about: "Gynécologue-obstétricienne spécialisée dans le suivi de grossesse et l'obstétrique. Passionnée par l'accompagnement des femmes à tous les âges de la vie.",
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Rabat', year: '2006' },
      { degree: 'Spécialisation en Gynécologie-Obstétrique', institution: 'Maternité Souissi, Rabat', year: '2011' }
    ],
    availableDays: ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi'],
    timeSlots: ['09:00', '10:00', '11:00', '14:30', '15:30', '16:30']
  },
  {
    id: '6',
    name: 'Dr. Mehdi El Fassi',
    specialty: 'Ophtalmologie',
    city: 'Fès',
    address: '34 Avenue des FAR, Fès',
    phone: '+212 535 678901',
    image: 'https://randomuser.me/api/portraits/men/59.jpg',
    rating: 4.7,
    reviewCount: 92,
    about: "Ophtalmologiste spécialisé dans la chirurgie réfractive et le traitement des maladies de la rétine. Utilise des technologies de pointe pour le diagnostic et le traitement.",
    education: [
      { degree: 'Doctorat en Médecine', institution: 'Faculté de Médecine de Fès', year: '2008' },
      { degree: 'Spécialisation en Ophtalmologie', institution: 'CHU Hassan II, Fès', year: '2013' }
    ],
    availableDays: ['Lundi', 'Mercredi', 'Jeudi', 'Samedi'],
    timeSlots: ['09:00', '10:00', '11:00', '15:00', '16:00', '17:00']
  }
];

export const appointments = [
  {
    id: '1',
    patientId: '1',
    doctorId: '1',
    doctorName: 'Dr. Yasmine Benali',
    specialty: 'Cardiologie',
    date: '2025-04-10',
    time: '09:00',
    status: 'confirmed',
    type: 'Consultation',
    notes: 'Suivi de tension artérielle'
  },
  {
    id: '2',
    patientId: '1',
    doctorId: '3',
    doctorName: 'Dr. Fatima Alaoui',
    specialty: 'Dermatologie',
    date: '2025-04-15',
    time: '14:30',
    status: 'pending',
    type: 'Première consultation',
    notes: 'Problème de peau'
  },
  {
    id: '3',
    patientId: '1',
    doctorId: '5',
    doctorName: 'Dr. Nadia Mansouri',
    specialty: 'Gynécologie',
    date: '2025-03-20',
    time: '11:00',
    status: 'completed',
    type: 'Consultation de suivi',
    notes: 'Tout est normal'
  }
];

export const doctorAppointments = [
  {
    id: '101',
    patientId: '1',
    patientName: 'Mohamed Alami',
    date: '2025-04-08',
    time: '09:00',
    status: 'confirmed',
    type: 'Consultation',
    notes: 'Première consultation'
  },
  {
    id: '102',
    patientId: '2',
    patientName: 'Leila Benjelloun',
    date: '2025-04-08',
    time: '10:00',
    status: 'confirmed',
    type: 'Suivi',
    notes: 'Renouvellement ordonnance'
  },
  {
    id: '103',
    patientId: '3',
    patientName: 'Ahmed Doukkali',
    date: '2025-04-08',
    time: '11:00',
    status: 'cancelled',
    type: 'Consultation',
    notes: 'Annulé par le patient'
  },
  {
    id: '104',
    patientId: '4',
    patientName: 'Saadia Chaoui',
    date: '2025-04-09',
    time: '09:00',
    status: 'confirmed',
    type: 'Contrôle',
    notes: 'Résultats d\'analyses'
  },
  {
    id: '105',
    patientId: '5',
    patientName: 'Rachid Bennani',
    date: '2025-04-09',
    time: '10:00',
    status: 'confirmed',
    type: 'Urgence',
    notes: 'Douleurs aiguës'
  }
];

export const weeklyStats = [
  { day: 'Lun', appointments: 8 },
  { day: 'Mar', appointments: 10 },
  { day: 'Mer', appointments: 7 },
  { day: 'Jeu', appointments: 9 },
  { day: 'Ven', appointments: 11 },
  { day: 'Sam', appointments: 6 },
  { day: 'Dim', appointments: 0 }
];

export const monthlyIncome = [
  { month: 'Jan', income: 12000 },
  { month: 'Fév', income: 13500 },
  { month: 'Mar', income: 15000 },
  { month: 'Avr', income: 14000 },
  { month: 'Mai', income: 16500 },
  { month: 'Juin', income: 17000 },
  { month: 'Juil', income: 18500 },
  { month: 'Août', income: 16000 },
  { month: 'Sep', income: 17500 },
  { month: 'Oct', income: 19000 },
  { month: 'Nov', income: 20500 },
  { month: 'Déc', income: 22000 }
];

export const patientsByAge = [
  { age: '0-18', count: 45 },
  { age: '19-30', count: 85 },
  { age: '31-45', count: 105 },
  { age: '46-60', count: 80 },
  { age: '60+', count: 60 }
];

export const subscriptionPlans = [
  {
    id: 'basic',
    name: 'Basique',
    price: 199,
    features: [
      'Gestion de calendrier',
      'Gestion des rendez-vous',
      'Rappels automatiques aux patients',
      'Profil médical personnalisé',
      'Support par email'
    ],
    popularFeature: 'Idéal pour les médecins individuels'
  },
  {
    id: 'premium',
    name: 'Premium',
    price: 399,
    features: [
      'Toutes les fonctionnalités du plan Basique',
      'Tableau de bord analytique avancé',
      'Rapports mensuels détaillés',
      'Exportation des données',
      'Support prioritaire',
      'Personnalisation du profil avancée'
    ],
    popularFeature: 'Recommandé pour les médecins établis'
  },
  {
    id: 'enterprise',
    name: 'Entreprise',
    price: 799,
    features: [
      'Toutes les fonctionnalités du plan Premium',
      'Analytique multi-sites',
      'Gestion d\'équipe médicale',
      'API personnalisée',
      'Support dédié 24/7',
      'Formations sur mesure',
      'Intégration avec d\'autres systèmes'
    ],
    popularFeature: 'Pour les cliniques et cabinets multiples'
  }
];
