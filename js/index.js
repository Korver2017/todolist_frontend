$(document).ready (function () {

  let $todolist;

  let $retrieve = () => {
    axios.get ('http://localhost:3000/')
    .then (res => {

      $todolist = res.data.map (d => {
        d.checked = false;
        return d;
      });

      console.log ($todolist);
      
      let $inputGroup = 
        `<div class="input-group mt-3">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <input class="checkbox" type="checkbox" aria-label="Checkbox for following text input">
            </div>
          </div>
          <input value="" readonly type="text" class="form-control">
        </div>`;

      $('.todo-list').text (' ');

      $todolist.forEach ((todo, i) => {

        $('.todo-list').append ($inputGroup);
        $($('.todo-list').find ('.form-control')[i]).val (todo.todo_id + ', ' + todo.todo_title + ', ' + todo.todo_desc);
        // $($('.todo-list').find ('.form-control')[i]).attr ('value', todo.todo_id + ', ' + todo.todo_title + ', ' + todo.todo_desc);
      });
    });
  }

  $retrieve ();
  
  $('.add-todo').click (function () {

    let todoTitle = $('.todo-title').val ()
      , todoDesc = $('.todo-desc').val ()
      , submitDate = $('.submit-date').val ()
      ;

    axios.post ('http://localhost:3000/add', {todo_title: todoTitle, todo_desc: todoDesc, submission_date: submitDate})
      .then (res => {

        $retrieve ();

        $('.todo-title').val ('');
        $('.todo-desc').val ('');
        $('.submit-date').val ('');
      });
  });

  $('.update-button').click (function () {

    axios.put ('http://localhost:3000/update', {todo_id: 16, todo_title: 'CSS', todo_desc: 'Learn CSS', submission_date: '2020-09-16'})
      .then (res => {
        console.log (res.data);

        $retrieve ();
      })
  });

  $('.delete-button').click (function () {

    $('.checkbox').each (function (i) {
      
      if ($(this).is (':checked'))
        $todolist[i].checked = true;

      else {
        $todolist[i].checked = false;
      }
    });

    let $destroyLoader = $todolist.map (todo => {

      if (todo.checked) {
        axios.post ('http://localhost:3000/remove', {todo_id: todo.todo_id})
          .then (res => $retrieve ())
      }
    });

    Promise.all ($destroyLoader);
  });

});