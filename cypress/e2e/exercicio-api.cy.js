/// <reference types="cypress" />

import contrato from '..//contracts/produtos.contract'

describe('Testes da Funcionalidade Usuários', () => {

  const token = "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6ImZ1bGFub0BxYS5jb20iLCJwYXNzd29yZCI6InRlc3RlIiwiaWF0IjoxNzI5OTYyMDM2LCJleHAiOjE3Mjk5NjI2MzZ9.MQNn9kNP9wdFd5l7kxqs-zMClymCNKouSWZ5BU4XHi0";
  
  it('Deve validar contrato de usuários', () => {
    cy.request('produtos').then(response=> {
        return contrato.validateAsync(response.body)
      })
  });

  it('Deve listar usuários cadastrados', () => {
    cy.request({
      method: 'GET',
      url: 'usuarios',
      headers: { authorization: token }
    }).should((response) => {
      expect(response.status).to.eq(200);
      
    });
  });

  it('Deve cadastrar um usuário com sucesso', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      headers: { authorization: token },
      body: {
        "nome": "Usuário Teste",
        "email": "usuario.teste@exemplo.com",
        "senha": "senhaSegura123"
      }
    }).should((response) => {
      expect(response.status).to.eq(201);
      expect(response.body.message).to.eq('Cadastro realizado com sucesso');
    });
  });

  it('Deve validar um usuário com email inválido', () => {
    cy.request({
      method: 'POST',
      url: 'usuarios',
      headers: { authorization: token },
      body: {
        "nome": "Usuário Invalido",
        "email": "usuario.invalido",
        "senha": "senhaSegura123"
      },
      failOnStatusCode: false 
    }).then(response => {
      expect(response.status).to.eq(400); 
      expect(response.body.email).to.equal('email deve ser um email válido'); 
    });
  });

  it('Deve editar um usuário previamente cadastrado', () => {
    let usuario = `Usuário EBAC ${Math.floor(Math.random() * 100000000)}`
        cy.cadastrarUsuario(token, 'usuario@teste.com', '12345', 'true')
          .then(response => {
              let id = response.body._id
              cy.request({
                method: 'PUT', 
                url: `usuario/${id}`,
                headers: {authorization: token}, 
                body: 
                {
                  "nome": usuario,
                  "email": "usuario@teste.com",
                  "password": "12345",
                  "administrador": "true"
                }
            }).then(response => {
                expect(response.body.message).to.equal('Registro alterado com sucesso')
            })
          })
            
        })
   

  it('Deve deletar um usuário previamente cadastrado', () => {
    let produto = `Usuário EBAC ${Math.floor(Math.random() * 100000000)}`
    cy.cadastrarUsuario(token, 'usuario@teste.com', '12345', 'true')
        .then(response => {
            let id = response.body._id
            cy.request({
                method: 'DELETE',
                url: `usuário/${id}`,
                headers: {authorization: token}
            }).then(response =>{
                expect(response.body.message).to.equal('Registro excluído com sucesso')
                expect(response.status).to.equal(200)
            })
        })
    });

});
