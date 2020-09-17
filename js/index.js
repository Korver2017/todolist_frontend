$(document).ready (function () {

  let $todolist
    , $updateData
    ;

  let $cancelEdit = () => {

    $('.edit-cancel').click (function () {

      let $editButton = $(this).parent ();

      $editButton.find ('button').hide ();
      $editButton.find ('.edit-todo').show ();

      let $index = $editButton.parent ().index ()
        , $todoItem = $($('.todo-item')[$index]);

      $todoItem.attr ('readonly', true).val ($todolist[$index].todo_item);
    });
  }
  
  let $updateTodo = () => {
    
    $('.update-todo').click (function () {

      let $editButton = $(this).parent ();

      let $index = $editButton.parent ().index ()
        , $todoItem = $($('.todo-item')[$index])
        , $id = $todolist[$index].todo_id
        ;

      $todoItem.attr ('readonly', true);

      axios.put ('http://localhost:3000/update', {todo_id: $id, todo_item: $todoItem.val ()})
        .then (res => $retrieve ());
    });
  }

  let $editTodo = () => {

    $('.edit-todo').click (function () {

      $(this).hide ();
      $(this).siblings ().show ();

      $(this).parent ().parent ().find ('.todo-item').attr ('readonly', false);
    });

    $cancelEdit ();
    $updateTodo ();
  }

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
            <button class="update-todo mx-1 btn btn-success">Confirm!</button>
            <button class="edit-cancel mx-1 btn btn-danger">Cancel!</button>
          </div>

        </div>`;

      $('.todo-list').text (' ');

      $todolist.forEach ((todo, i) => {

        $('.todo-list').append ($inputGroup);
        $($('.todo-list').find ('.todo-item')[i]).val (todo.todo_item);
      });

      $editTodo ();
    });
  }

  $retrieve ();
  
  $('.add-todo').click (function () {

    let newTodo = $('.new-todo').val ();

    axios.post ('http://localhost:3000/add', {todo_item: newTodo})
      .then (res => {

        $retrieve ();

        $('.todo-title').val ('');
        $('.todo-desc').val ('');
        $('.submit-date').val ('');
        $('.new-todo').val ('');
      });
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