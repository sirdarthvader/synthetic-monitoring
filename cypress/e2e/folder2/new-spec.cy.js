import { STG02_AUTH_URL } from '../../utils';

describe('login v2', () => {
  beforeEach(() => {
    cy.visit(`${STG02_AUTH_URL}/auth/login`);
  });

  it('should naviagte to idv2 login and load the page', () => {
    cy.contains("Don't have an account ID?");
  });
});
