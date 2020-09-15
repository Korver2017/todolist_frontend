axios.get ('http://localhost:3000/')
  .then (res => {
    console.log (res.data);
  })

$('.create-button').click (function () {

  axios.post ('http://localhost:3000/add', {todo_title: 'PHP', todo_desc: 'Learn PHP', submission_date: '2020-09-14'})
    .then (res => {
      console.log (res.data);
    })
});

$('.update-button').click (function () {

  axios.put('http://localhost:3000/update', { todo_id: 13, todo_title: 'MySQL', todo_desc: 'Learn MySQL', submission_date: '2020-09-14'})
    .then (res => {
      console.log (res.data);
    })
});

$('.delete-button').click (function () {

  axios.post ('http://localhost:3000/remove', {todo_id: 13})
    .then (res => {
      console.log (res.data);
    })
});