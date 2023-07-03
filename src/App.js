import React, { useEffect, useState } from 'react';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [currentRecipe, setCurrentRecipe] = useState({
    title: '',
    ingredients: '',
    preparation: '',
  });

  useEffect(() => {
    fetchRecipes();
  }, []);

  const fetchRecipes = async () => {
    try {
      const response = await fetch('http://localhost:1337/receitas');
      const data = await response.json();
      if (Array.isArray(data)) {
        setRecipes(data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleInputChange = (e) => {
    setCurrentRecipe((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:1337/receitas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(currentRecipe),
      });
      const data = await response.json();
      setRecipes((prevState) => [...prevState, data]);
      setCurrentRecipe({
        title: '',
        ingredients: '',
        preparation: '',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (recipe) => {
    setCurrentRecipe(recipe);
  };

  const handleUpdate = async () => {
    try {
      const response = await fetch(
        `http://localhost:1337/receitas/${currentRecipe.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(currentRecipe),
        }
      );
      const data = await response.json();
      setRecipes((prevState) =>
        prevState.map((recipe) =>
          recipe.id === data.id ? { ...recipe, ...data } : recipe
        )
      );
      setCurrentRecipe({
        title: '',
        ingredients: '',
        preparation: '',
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:1337/receitas/${id}`, {
        method: 'DELETE',
      });
      setRecipes((prevState) => prevState.filter((recipe) => recipe.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <h1>Gerenciador de Receitas</h1>
      <form onSubmit={currentRecipe.id ? handleUpdate : handleSubmit}>
        <div>
          <label>Título:</label>
          <input
            type="text"
            name="title"
            value={currentRecipe.title}
            onChange={handleInputChange}
            required
          />
        </div>
        <div>
          <label>Ingredientes:</label>
          <textarea
            name="ingredients"
            value={currentRecipe.ingredients}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <div>
          <label>Modo de Preparo:</label>
          <textarea
            name="preparation"
            value={currentRecipe.preparation}
            onChange={handleInputChange}
            required
          ></textarea>
        </div>
        <button type="submit">
          {currentRecipe.id ? 'Salvar' : 'Adicionar'}
        </button>
      </form>
      <ul>
        {recipes.map((recipe) => (
          <li key={recipe.id}>
            <h2>{recipe.title}</h2>
            <p>Ingredientes: {recipe.ingredients}</p>
            <p>Modo de Preparo: {recipe.preparation}</p>
            <button onClick={() => handleEdit(recipe)}>Editar</button>
            <button onClick={() => handleDelete(recipe.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;