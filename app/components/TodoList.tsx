"use client"

import { useState, useCallback, useEffect } from 'react'
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2 } from 'lucide-react'

interface Todo {
  id: number
  text: string
  completed: boolean
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [todo, setTodo] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  
  useEffect(() => {
    const data = async() => {
      try {
        const fetchData = await fetch('api/todos')
        if(!fetchData.ok) throw new Error('Erreur lors de la récupération des données')
        const result = await fetchData.json()
        setTodos(result.todos)
        console.log(result)    
      }catch(error) {
        console.error(error)
      }finally {
        setIsLoading(false)
      }
    }
    data()
  }, [])

  const onSubmit = async(e: React.FormEvent) => {     
      e.preventDefault()
      const NewTodo = {
          text: todo,
          completed: false
      }        

      try {
          const response = await fetch('api/todos', {
              method: "POST",
              headers: {
                  "Content-Type": "application/json",
              },
              body: JSON.stringify(NewTodo)
          })
          if(!response.ok) throw new Error('Erreur lors de l\'ajout des données')
          const result = await response.json()
          setTodos([...todos, result.todo])
          setTodo('')
      }catch(error) {
          console.error(error)
      }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setTodo(e.target.value)
  }

  const toggleTodo = async (id: number) => {
      const prevTodo = [...todos]
      setTodos((prevTodos) => prevTodos.map((todo) => todo.id === id ? {...todo, completed: !todo.completed} : todo))

      try {
        const todo = todos.find((todo) => todo.id === id)
        if (!todo) {
          console.error('Tâche non trouvée')
          return
        }
        const data = {...todo, completed: !todo?.completed}

        const response = await fetch(`api/todos/${id}`,{
          method:"PUT",
          headers: {
            'ContentType': "application/json"
          },
          body: JSON.stringify(data)
        })
        
        if(!response.ok) throw new Error('Erreur lors de la modification des données')
        
        const result = response.json()
      }catch(error) {
        console.error(error)
        setTodos(prevTodo)
      }
  }

  const deleteTodo = async(id: number) => {
      try {
        const response = await fetch(`api/todos/${id}`,{
          method:"DELETE",
        })
        if(!response) throw new Error('Erreur lors de la suppression des données')
        
        setTodos(todos.filter((todo) => todo.id !== id))

      } catch(error) {
        console.error(error)
      }
  }

  if (isLoading) return <p>Chargement...</p>;

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-xl">
      <h1 className="text-2xl font-bold mb-4 text-center">Ma Liste de Tâches</h1>
      <form onSubmit={onSubmit} className='flex mb-4'>
        <Input
            type="text"
            placeholder="Ajouter une nouvelle tâche"
            className="flex-grow mr-2"
            onChange={handleChange}
            value={todo}
        />
        <Button type='submit'>Ajouter</Button>
      </form>
      <ul>
        {todos.map(todo => (
          <li key={todo.id} className="flex items-center mb-2 bg-gray-100 p-2 rounded">
            <Checkbox
              checked={todo.completed}
              onCheckedChange={() => toggleTodo(todo.id)}
              className="mr-2"
            />
            <span className={`flex-grow ${todo.completed ? 'line-through text-gray-500' : ''}`}>
              {todo.text}
            </span>
            <Button variant="ghost" size="icon" onClick={() => deleteTodo(todo.id)}>
              <Trash2 className="h-4 w-4" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
}

