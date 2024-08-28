# == Demo Note View ==

## About this project
This is a simple View for demo cypress purpose.
only containing simple login and simple CRUD that use expressjs.

## How to Use
1. Make sure you have installed node in your computer.

2. Clone the project

```bash
  git clone https://github.com/adhitirafr/cypress_demo_nextjs
```

3. Go to the project directory

```bash
  cd cypress_demo_nextjs
```

4. Install dependencies

```bash
  npm install
```

7. copy the .env.example to .env, fill the variable that needed to access the table
```bash
  cp .env.example .env
```

Sample:
```bash
APP_ENV = "development"
NEXT_PUBLIC_BASE_URL_API = "fill with your API url"
```
1
8. Start the server

```bash
  npm run dev

```

## License
[MIT](https://choosealicense.com/licenses/mit/)

npx cypress run --spec "cypress/e2e/your-test-file.spec.js"
