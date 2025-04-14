import {
  Alert,
  FlatList, Image, SafeAreaView, StyleSheet, Text, TextInput,
  TouchableOpacity, View, KeyboardAvoidingView,
  Keyboard,
  Pressable,
  useColorScheme
} from 'react-native'
import React, { useEffect } from 'react'
import Icon from 'react-native-vector-icons/Feather';
import SearchIcon from 'react-native-vector-icons/AntDesign';
import ClearSearchIcon from 'react-native-vector-icons/MaterialIcons';
import DeleteIcon from 'react-native-vector-icons/MaterialIcons';
import AddIcon from 'react-native-vector-icons/Ionicons';
import { useState } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage';

import CheckBox from 'react-native-check-box'
import babelConfig from './babel.config';






const App = () => {

  const theme = useColorScheme();
  // const isDark = (theme === 'dark');
  const isDark = false;
  const textboxcolor = isDark ? "gray" : "red;"
  const tododata = [
   
    // {
    //   id: 2,
    //   name: 'Todo list 2',
    //   isDone: true

    // },
    // {
    //   id: 3,
    //   name: 'Todo list 3',
    //   isDone: false

    // },
    // {
    //   id: 4,
    //   name: 'Todo list 4',
    //   isDone: false

    // },
    // {
    //   id: 5,
    //   name: 'Todo list 5',
    //   isDone: false

    // },
    // {
    //   id: 6,
    //   name: 'Todo list 6',
    //   isDone: false

    // }
  ]

  const [todos, settodos] = useState([]);
  const [todoText, settodoText] = useState('');
  const [Searchquery, setSearchquery] = useState('');
  const [oldtodos, setoldtodos] = useState([])

  useEffect(() => {
    const getTodo = async () => {
      try {

        const todos = await AsyncStorage.getItem('my-todo')
        if (todos !== null) {
          settodos(JSON.parse(todos))
          setoldtodos(JSON.parse(todos))
        }
      }
      catch (error) {
        console.log(error)
        Alert.alert(error)
      }
    }
    getTodo();

  }, [])

  const addTodo = async () => {
    if (todoText !== '') {
      try {
        const newTodo = {
          id: Math.random(),
          name: todoText,
          isDone: false
        }
        todos.push(newTodo);
        settodoText(todos);
        setoldtodos(todos);
        await AsyncStorage.setItem('my-todo', JSON.stringify(todos))
        settodoText('')
        Keyboard.dismiss();

      }
      catch (error) {
        console.log('gdtg' + error)
        Alert.alert(error)

      }

    }
    else {
      Alert.alert("Plz enter some task.")
    }


  }
  const deletetodo = async (id) => {
    try {
      const newtodo = todos.filter((todos) => todos.id !== id)
      await AsyncStorage.setItem('my-todo', JSON.stringify(newtodo))
      settodos(newtodo);
      setoldtodos(newtodo);

    }
    catch (error) {

      console.log(error)
      Alert.alert(error)

    }
  }

  const handleDone = async (id) => {
    try {
      const newtodo = todos.map((todo) => {
        if (todo.id === id) {
          todo.isDone = !todo.isDone;

        }
        return todo;

      })
      await AsyncStorage.setItem('my-todo', JSON.stringify(newtodo))
      settodos(newtodo);
      setoldtodos(newtodo);


    }
    catch (error) {
      console.log(error);
      Alert.alert(error)

    }
  }

  const onsearch = (query) => {
    if (query == '') {
      settodos(oldtodos)
    }
    else {
      const filteredtodo = todos.filter((todo) =>
        todo.name.toLowerCase().includes(query.toLowerCase())
      )
      settodos(filteredtodo);


    }

  }


  useEffect(() => {
    onsearch(Searchquery)
  }, [Searchquery])

  const ClearSearchBox = () => (
    setSearchquery(''),
    Keyboard.dismiss()

  )
  return (
    <SafeAreaView style={[styles.container, isDark ? { backgroundColor: "black" } : null]}>
      <View style={styles.TopBar}>
        <TouchableOpacity onPress={() => { Alert.alert("faizan") }}>
          <Icon name="menu" size={40} color={textboxcolor} />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => Alert.alert('amana')}>

          <Image
            style={styles.ImageSize}
            source={{ uri: 'https://images.unsplash.com/photo-1554126807-6b10f6f6692a?w=400&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Nnx8Ym95fGVufDB8fDB8fHww' }} />

        </TouchableOpacity>
      </View>
      <View style={[styles.searchBar, isDark ? { backgroundColor: "rgba(30, 30, 30,0.9)" } : null]}>
        <SearchIcon

          name="search1" size={35} color={isDark ? "rgba(140, 140, 140,0.9)" : "#333"} />

        <TextInput
          style={[styles.searchInput, isDark ? { backgroundColor: "rgba(30, 30, 30,0.9)" } : null,
          isDark ? { color: "#fff" } : null
          ]}
          value={Searchquery}
          onChangeText={(text) => setSearchquery(text)}
          placeholder='Search'
          placeholderTextColor={isDark ? "rgba(140, 140, 140,0.9)" : "#333"}

        />
        <Pressable onPress={() => ClearSearchBox()}>
          <ClearSearchIcon

            name="clear" size={35} color={isDark ? "rgba(140, 140, 140,0.9)" : "#333"} />

        </Pressable>



      </View>

      <FlatList
        data={[...todos].reverse()}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Todoitem item={item} deletetodo={deletetodo} handleDone={handleDone} isDark={isDark} />

        )}
      />
      <KeyboardAvoidingView style={styles.footer} behavior="padding"
        keyboardVerticalOffset={10}
      >
        <TextInput
          style={[styles.addtodotext, {
            backgroundColor: isDark ? "rgba(30, 30, 30,0.9)" : "#fff",
            color: isDark ? '#fff' : '#333'
          }]}
          value={todoText}
          onChangeText={(text) => settodoText(text)}
          placeholder='Add new Todo'
          placeholderTextColor={isDark ? "rgba(140, 140, 140,0.9)s" : "black"}
          autoCorrect={false}
          autoCapitalize={false}
        />
        <TouchableOpacity style={styles.addButton}
          onPress={() => addTodo()}
        >

          <AddIcon name="add" size={34} color="#fff" />

        </TouchableOpacity>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const Todoitem = ({ item, deletetodo, handleDone, isDark }) => (
  <View style={[styles.todoContainer, isDark ? { backgroundColor: "rgba(50, 50, 50,0.9)" } : null,]}>
    <View style={styles.todoInfoContainer}>
      <CheckBox
        onClick={() => handleDone(item.id)}
        isChecked={item.isDone}
        checkBoxColor={isDark ? "rgba(140, 140, 140,0.9)" : "#333"}
        checkedCheckBoxColor="#4630EB"
      />
      <Text style={[styles.todotext,
      isDark ? { color: "#fff" } : null,
      item.isDone && { textDecorationLine: "line-through" }]} >{item.name}</Text>
    </View>
    <TouchableOpacity onPress={() => { deletetodo(item.id); Alert.alert("delete" + item.id) }}>
      <DeleteIcon name="delete-forever" size={30} color="red" />

    </TouchableOpacity>

  </View>

)

export default App

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: "#E0E0E0",
    paddingTop: 20,
    padding: 10,
  },
  text: {
    fontSize: 30
  },
  ImageSize: {
    width: 45,
    height: 45,
    borderRadius: 25
  },
  TopBar: {
    flexDirection: 'row',
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20

  },
  searchBar: {
    backgroundColor: '#fff',
    flexDirection: "row",
    padding: 16,
    borderRadius: 10,
    gap: 10,
    marginBottom: 20

  },
  searchInput: {
    backgroundColor: "#fff",
    flex: 1,
    fontSize: 16,
    color: "#333"
  },
  todoContainer: {

    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 10,
    marginBottom: 20,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  todoInfoContainer: {
    flexDirection: "row",
    gap: 10,
    alignItems: "center"
  },
  todotext: {
    fontSize: 16,
    color: "#333",
  },
  addButton: {
    backgroundColor: "#4630EB",
    padding: 8,
    borderRadius: 10,
    marginLeft: 5

  },
  addtodotext: {
    backgroundColor: "#fff",
    flex: 1,
    padding: 16,
    borderRadius: 10,
    fontSize: 16,
    color: "#333"

  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 10
  }
})