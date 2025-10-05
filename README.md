# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## OpenRouter AI Integration

Environment variables (create `.env.local`):

```
VITE_OPENROUTER_API_KEY=sk-or-...
VITE_OPENROUTER_BASE_URL=https://openrouter.ai/api/v1
VITE_OPENROUTER_MODEL=openai/gpt-4o-mini
```

Client and hook:

- `src/lib/openrouter.js` provides `chatCompletions({ messages, model })`
- `src/hooks/useAI.jsx` exposes `askTutor(userMessage, userProfile)` with loading/error state

Example usage:

```jsx
import { useAI } from './hooks/useAI.jsx';

function TutorExample({ profile }) {
  const { askTutor, loading, error } = useAI();

  async function onAsk() {
    const reply = await askTutor('Suggest actions for today', profile);
    console.log('AI:', reply);
  }

  return (
    <div>
      <button onClick={onAsk} disabled={loading}>Ask Tutor</button>
      {error && <p>{String(error.message || error)}</p>}
    </div>
  );
}
```
