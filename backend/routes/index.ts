import { Application, Router } from 'express';

// controllers
import { AuthController } from '../controllers/Auth.controller';
import { DoctorsController } from '../controllers/Doctors.controller';
import { PatientsController } from '../controllers/Patients.controller';
import { WorkPricesController } from '../controllers/WorkPrices.controller';
import { DaljetController } from '../controllers/Daljet.controller';

const endpoints: [string, Router][] = [
    ['/api/auth', AuthController],
    ['/api/doctors', DoctorsController],
    ['/api/patients', PatientsController],
    ['/api/prices', WorkPricesController],
    ['/api/daljet', DaljetController]
];

export const routes = (app: Application): void => {
    [...endpoints].forEach((route) => {
        const [url, controller] = route;
        app.use(url, controller);
    });
};
