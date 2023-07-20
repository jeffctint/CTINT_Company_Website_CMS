import request from 'supertest';
import App from '../app';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';

afterAll(async () => {
  await new Promise<void>(resolve => setTimeout(() => resolve(), 500));
});

describe('Testing Users', () => {
  describe('[GET] /users', () => {
    it('response statusCode 200 / findAll', () => {
      const findUser: User[] = userModel;
      const app = new App();

      return request(app.getServer()).get('/api/users/').expect(200, { data: findUser, message: 'findAll' });
    });
  });

  describe('[GET] /users/:id', () => {
    it('response statusCode 200 / findOne', () => {
      const userId = 1;
      const findUser = userModel.find(user => user.id === userId);

      const app = new App();

      return request(app.getServer()).get('/api/users/1').expect(200, { data: findUser, message: 'findOne' });
    });
  });

  describe('[POST] /users', () => {
    it('response statusCode 201 / created', async () => {
      const userData = {
        email: 'example@email.com',
        password: 'password',
      };
      const app = new App();

      return request(app.getServer()).post('/api/users/').send(userData).expect(201);
    });
  });

  describe('[PUT] /users/:id', () => {
    it('response statusCode 200 / updated', async () => {
      const userId = 1;
      const userData = {
        email: 'example@email.com',
        password: 'password',
      };
      const app = new App();

      return request(app.getServer()).put('/api/users/1').send(userData).expect(200);
    });
  });

  describe('[DELETE] /users/:id', () => {
    it('response statusCode 200 / deleted', () => {
      const userId = 1;
      const deleteUser: User[] = userModel.filter(user => user.id !== userId);
      const app = new App();

      return request(app.getServer()).delete('/api/users/1').expect(200, { data: deleteUser, message: 'deleted' });
    });
  });
});
