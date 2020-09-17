$(document).ready (function () {

  let $todolist
    , $updateData
    ;

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

          <input value="" readonly type="text" class="todo-item form-control">

          <div class="edit-button">
            <button class="edit-todo mx-1 btn btn-warning">Edit!</button>
            <button class="edit-confirm mx-1 btn btn-success">Confirm!</button>
            <button class="edit-cancel mx-1 btn btn-danger">Cancel!</button>
          </div>

        </div>`;

      $('.todo-list').text (' ');

      $todolist.forEach ((todo, i) => {

        $('.todo-list').append ($inputGroup);
        $($('.todo-list').find ('.todo-item')[i]).val (todo.todo_id + ', ' + todo.todo_title + ', ' + todo.todo_desc);
        // $($('.todo-list').find ('.form-control')[i]).attr ('value', todo.todo_id + ', ' + todo.todo_title + ', ' + todo.todo_desc);
      });

      $('.edit-todo').click (function () {

        $(this).hide ();
        $(this).siblings ().show ();

        $(this).parent ().parent ().find ('.todo-item').attr ('readonly', false);
      });

      $('.edit-cancel').click (function () {

        let $editButton = $(this).parent ();

        $editButton.find ('button').hide ();
        $editButton.find ('.edit-todo').show ();

        let $index = $editButton.parent ().index ()
          , $todoItem = $($('.todo-item')[$index]);

        $todoItem.attr ('readonly', true).val ($todolist[$index].todo_title);
      });

      $('.edit-confirm').click (function () {

        let $editButton = $(this).parent ();

        // $editButton.find ('button').hide ();
        // $editButton.find ('.edit-todo').show ();

        let $index = $editButton.parent ().index ()
          , $todoItem = $($('.todo-item')[$index])
          , $updatedTodo = $todolist[$index]
          ;

        $todoItem.attr ('readonly', true);
        // $todoItem.attr ('readonly', true).val ($todolist[$index].todo_title);

        console.log ($updatedTodo);

        axios.put ('http://localhost:3000/update', {todo_id: $updatedTodo.todo_id, todo_title: $todoItem.val (), todo_desc: $updatedTodo.todo_desc, submission_date: '2020-09-16'})
          .then (res => {
            console.log (res.data);

            $retrieve ();
          })
      })
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