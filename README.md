# Front-End UI/UX Developer Challenge

O projeto inclui um menu lateral, a capacidade de carregar a página "Cupons de Desconto" e suas funções de cadastro, exclusão, listagem e relatórios.

## Pré-requisitos

- [Node.js](https://nodejs.org) instalado no seu sistema.

## Configurando o Ambiente

1. Clone este repositório para o seu computador:

https://github.com/wallacev/front-end-ui-ux-developer-challenge.git


2. Navegue até o diretório do projeto:

cd front-end-ui-ux-developer-challenge


3. Instale as dependências locais (estou utilizando apenas o http-server):

npm install


## Executando o Servidor Local

Para visualizar o projeto localmente, siga os passos abaixo:

1. Inicie o servidor local com o seguinte comando:

npm start


2. Abra o seu navegador da web e acesse o seguinte URL:

http://localhost:8080

Você deve ver uma página como essa 

![image](https://github.com/wallacev/front-end-ui-ux-developer-challenge/assets/18698901/40e89875-1792-4018-b2fb-72e7576bae20)



## Acessando a Página "Cupons de Desconto"

Agora que o servidor local está em execução, você pode acessar a página "Cupons de Desconto" no projeto:


1. Clique na opção "Cupons de Desconto" no menu lateral. A página "Cupons de Desconto" será carregada no conteúdo principal.

## Próximos Passos

Ative o toggle de cupom de descontos para começar a cadastrar seus cupons de desconto

![image](https://github.com/wallacev/front-end-ui-ux-developer-challenge/assets/18698901/81ce868e-fa70-437a-9d74-4a2d873b34cb)


Ao ativar insira os dados do cupom de descontos, a listagem, gráfico e o faturamento dos cupons não depende da funcionalidade estar com o toggle ligado



![image](https://github.com/wallacev/front-end-ui-ux-developer-challenge/assets/18698901/7449816a-2b2f-417d-ae03-56fdaefdb6c7)


O gráfico será exibido desde que haja cupons cadastrados, para o projeto estou utilizando o localStorage para armazenamento

![image](https://github.com/wallacev/front-end-ui-ux-developer-challenge/assets/18698901/a00e1a11-5198-4f46-9b3e-67b296391144)


Para testar as funcionalidades do gráfico e de faturamento também adicionei um botão para registrar o uso do cupom, ao recarregar a página os dados devem persistir e o gráfico atualizar com as novas informações

![image](https://github.com/wallacev/front-end-ui-ux-developer-challenge/assets/18698901/fb59a9cc-f30d-4856-80a9-a08b5c14a883)



