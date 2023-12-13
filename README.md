# Boardcamp
Aplicação back-end para construção do sistema de gestão de uma locadora de jogos de tabuleiro em Banco de Dados Relacional (SQL), utilizando arquitetura em camadas.

# Demo 
[Link do back-end](https://boardcamp-api-n2fq.onrender.com)

# Como funciona?
Este projeto é uma API para atender a aplicação de aluguel de jogos de tabuleio de uma locadora. Ela possui três entidades: `games`, `customers` e `rentals`. As características desta entidade são:

### Formato dos dados:

``` jsx
games = {
  id: 'ID do jogo',
  name: 'nome do jogo',
  image: 'URL da imagem',
  stockTotal: 'quantidade total de jogos no estoque',
  pricePerDay: 'preço por dia do jogo',
}

customers = {
  id: 'ID do cliente',
  name: 'nome do cliente',
  phone: 'número do celular/telefone do cliente',
  cpf: 'CPF do cliente',
  birthday: 'data de aniversário do cliente (formato: YYYY-MM-DD => 1992-10-25)'
}

rentals = {
  id: 'ID do alugel',
  customerId: 'ID do cliente',
  gameId: 'ID do jogo',
  rentDate: 'data em que o aluguel foi feito',
  daysRented: 'quantidade de dias que o cliente agendou o aluguel',
  returnDate: 'data que o cliente devolveu o jogo (default: null)',
  originalPrice: 'preço total do aluguel em centavos (dias alugados vezes o preço por dia do jogo)',
  delayFee: 'multa total paga por atraso (dias que passaram do prazo vezes o preço por dia do jogo)'  
}
```
Para cada entidada foi realizado um CRUD:

### CRUD de Jogos [Create | Read]
- GET `/games`: Retorna todos os jogos encontrados.
- POST `/games`: Cria um novo jogo. Recebe *name*, *image*, *stockTotal* e *pricePerDay* pelo body. Os jogos não podem ter nomes iguais, caso isso aconteça, um erro 409 é retornado. O nome não pode ser vazio, estoque e preço por dia devem ser maiores que zero, caso isso aconteça, o erro 400 é retornado. A estrutura esperada para um jogo é:
```
{
  "name": 'Banco Imobiliário',
  "image": 'http://www.imagem.com.br/banco_imobiliario.jpg',
  "stockTotal": 3,
  "pricePerDay: 1500
}
```

### CRUD de Clientes [Create | Read | Update]
- GET `/customers`: Retorna todos os clientes encontrados.
- GET `/customers/:id`: Busca um cliente especifico dado um id. Se não for encontrado, retorna um erro 404.
- POST `/customers`: Cria um novo jogo. Recebe *name*, *phone*, *cpf* e *birthday* pelo body. O CPF dos clientes não podem ser iguais, caso isso aconteça, um erro 409 é retornado. O CPF deve ter 11 caracteres numéricos, telefone deve ter 10 ou 11 caracteres numéricos, nome deve estar presente e não pode ser vazio e aniversário deve ser uma data válida, caso isso não aconteça, um erro 400 é retornado. A estrutura esperada para um cliente é:
```
{
  "name": 'João Alfredo',
  "phone": '21998899222',
  "cpf": '01234567890',
  "birthday": '1992-10-25'
}
```
- PUT `/cistomers/:id`: Atualiza os dados de um cliente dado o seu id e os campos enviados. O CPF não pode ser de um cliente já existente, caso isso aconteça, o erro 409 é retornado. Observe que o conflito só deve ocorrer caso o CPF enviado pertença a outro usuário. O usuário pode desejar atualizar outras propriedades, mas manter seu CPF atual. A estrutura esperada para um cliente é o mesmo do POST.

### CRUD de Aluguéis [Create | Read | Update | Delete]
- GET `/rentals`: Retorna todos os aluguéis encontrados, contendo o cliente e o jogo do aluguel em questão em cada aluguel.
- POST `/rentals`: Cria um novo aluguel. Recebe *customersId*, *gameId* e *daysRented* pelo body. Ao inserir o aluguel, os campos *rentDate*: data atual no momento da inserção e *originalPrice*: *dayRented* multiplicado pelo preço por dia do jogo no momento da inserção, são populados automaticamente antes de salvá-lo, os campos *returnDate* e *delayFee* sempre começam como nulos. Os ids do cliente e do jogo se referem a um cliente e um jogo existentes, caso isso não aconteça, é retornado um erro 400. Os dias alugados deve ser um número maior que zero, caso isso não aconteça, deve retornar um erro 400. Ao inserir um aluguel, é validado se existem jogos disponíveis, ou seja, que não tem alugueis em aberto acima da quantidade de jogos em estoque. Caso contrário, é retornado um erro 400. A estrutura esperada é:
```
{
  customerId: 1,
  gameId: 1,
  daysRented: 3
}
```
- POST `/rentals/:id/return`: Finaliza um aluguel e atualiza os campos *returnDate* e *delayFee* com a data atual e o valor equivalente ao número de dias de atraso vezes o preço por dia do jogo no momento do retorno. Se o id não corresponder a nenhum aluguel, o erro 404 é retornado. É verificado se o aluguel já não está finalizado, se estiver, o erro 400 é retornado. A estrutura esperada é a mesma do POST `/rentals`.
- DELETE `/rentals/:id`: Deleta um aluguel dado o seu id. Se o id não existir é retornado um erro 404. Se o aluguel já não estiver finalizado, é retornado um erro 400.

# Motivação
Este projeto foi feito para praticar a constução de uma API usando o ecossistema Node e Express e banco de dados relacional (SQL).

# Tecnologias utilizadas
Para este projeto foram utilizadas:

- Node;
- Express;
- Cors;
- Dayjs;
- Dotenv;
- Joi;
- PG.

# Como rodar em desenvolvimento
Para executar este projeto em desenvolvimento, é necessário seguir os passos abaixo:

- Clonar o repositório;
- Baixar as dependências necessárias com o comando: `npm install`;
- Em seguida, criar o arquivo `.env` com base no `.env.example`;
- Este arquivo `.env` é composto pelas seguintes propriedades:
```
  DATABASE_URL="postgresql://postgres..."
  PORT=5000
```
- A propriedade `DATABASE_URL` é usada para fazer a conexão com o banco de dados, e `PORT` é usada para definir a porta que o projeto será executado.
- Para rodar o projeto em desenvolvimento, execute o comando `npm run dev`.
