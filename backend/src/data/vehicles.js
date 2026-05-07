// Flotte de 10 véhicules avec positions GPS réalistes autour de Mons
const VEHICLES = [
  {
    id: 'TX-01', plate: 'AB-123-CD', driver: 'Marc Dupont',
    status: 'disponible', km: 142340, fuel: 78, coursesToday: 5, revenueToday: 210,
    lat: 50.4541, lng: 3.9568, // Mons Centre
    route: 'Mons Centre',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-02', plate: 'BC-456-DE', driver: 'Sara Lemaire',
    status: 'disponible', km: 98210, fuel: 92, coursesToday: 3, revenueToday: 130,
    lat: 50.4547, lng: 3.9519, // Grand-Place
    route: 'Grand-Place',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-03', plate: 'CD-789-EF', driver: 'Jean Moreau',
    status: 'disponible', km: 210540, fuel: 55, coursesToday: 6, revenueToday: 280,
    lat: 50.4783, lng: 3.9057, // Ghlin
    route: 'Ghlin',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-04', plate: 'DE-012-FG', driver: 'Amina Bouzid',
    status: 'maintenance', km: 175000, fuel: 30, coursesToday: 0, revenueToday: 0,
    lat: 50.4505, lng: 3.9460, // Garage
    route: 'Garage maintenance',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-05', plate: 'EF-345-GH', driver: 'Luc Renard',
    status: 'disponible', km: 88700, fuel: 64, coursesToday: 4, revenueToday: 175,
    lat: 50.4329, lng: 3.9206, // Cuesmes
    route: 'Cuesmes',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-06', plate: 'FG-678-HI', driver: 'Nora Petit',
    status: 'disponible', km: 132000, fuel: 88, coursesToday: 2, revenueToday: 85,
    lat: 50.4408, lng: 3.9623, // Hyon
    route: 'Hyon',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-07', plate: 'GH-901-IJ', driver: 'Karim Ouali',
    status: 'hors-service', km: 305000, fuel: 10, coursesToday: 0, revenueToday: 0,
    lat: 50.4490, lng: 3.9700, // Zone est
    route: 'Hors service',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-08', plate: 'HI-234-JK', driver: 'Sophie Laurent',
    status: 'disponible', km: 54200, fuel: 71, coursesToday: 5, revenueToday: 245,
    lat: 50.4833, lng: 3.9761, // Saint-Denis
    route: 'Saint-Denis',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-09', plate: 'IJ-567-KL', driver: 'Pierre Tran',
    status: 'disponible', km: 167800, fuel: 95, coursesToday: 3, revenueToday: 115,
    lat: 50.4628, lng: 3.9494, // Maisières
    route: 'Maisières',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
  {
    id: 'TX-10', plate: 'JK-890-LM', driver: 'Fatou Diallo',
    status: 'maintenance', km: 220100, fuel: 20, coursesToday: 0, revenueToday: 0,
    lat: 50.4480, lng: 3.9400, // Garage 2
    route: 'Garage maintenance',
    lastUpdate: new Date().toLocaleTimeString('fr-BE', { hour: '2-digit', minute: '2-digit' })
  },
];

// Rues de Mons pour les trajets simulés
const STREETS = {
  'Mons Centre': { lat: 50.4541, lng: 3.9568 },
  'Grand-Place': { lat: 50.4547, lng: 3.9519 },
  'Gare de Mons': { lat: 50.4556, lng: 3.9406 },
  'Ghlin': { lat: 50.4783, lng: 3.9057 },
  'Nimy': { lat: 50.4760, lng: 3.9590 },
  'Cuesmes': { lat: 50.4329, lng: 3.9206 },
  'Jemappes': { lat: 50.4480, lng: 3.8882 },
  'Hyon': { lat: 50.4408, lng: 3.9623 },
  'Saint-Denis': { lat: 50.4833, lng: 3.9761 },
  'Obourg': { lat: 50.4744, lng: 4.0003 },
  'Maisières': { lat: 50.4628, lng: 3.9494 },
  'Havré': { lat: 50.4632, lng: 3.9841 },
};

module.exports = { VEHICLES, STREETS };
