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
        , $id = $todolist[$index].id
        ;

      $todoItem.attr ('readonly', true);

      axios.put ('http://localhost:3000/update', {id: $id, todo_item: $todoItem.val ()})
        .then (res => {

          console.log (res.data);

          $editButton.show ();
          $editButton.siblings ().hide ();
          $retrieve ();
        });
    });
  }

  let $editTodo = () => {

    let $editTodo = $('.edit-todo');

    $editTodo.click (function () {

      let $this = $(this)
        , $index = $editTodo.index ($this)
        ;

      $this.hide ();
      $this.siblings ().show ();

      $($('.todo-item')[$index]).attr ('readonly', false);
    });

    //? TODO: Check 2 below function

    $cancelEdit ();
    $updateTodo ();
  };

  let $checkButtonState = () => {

    let $checkbox = $('.checkbox');

    $checkbox.change (function () {
        
      let $checked = Array.from ($checkbox).some (c => c.checked === true)
        , $doneTodo = $('.done-todo')
        , $deleteTodo = $('.delete-todo')
        ;

      if ($checked) {
        $doneTodo.attr ('disabled', false);
        $deleteTodo.attr ('disabled', false);
      }

      else {
        $doneTodo.attr ('disabled', true);
        $deleteTodo.attr ('disabled', true);
      }
    });
  };

  let $retrieve = () => {

    axios.get ('http://localhost:3000/')
      .then (res => {

        $todolist = res.data.map (todo => {
          todo.checked = false;
          return todo;
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

        let $todoList = $('.todo-list');

        $todoList.text (' ');

        $todolist.forEach ((todo, i) => {
          $todoList.append ($inputGroup);
          $($todoList.find ('.todo-item')[i]).val (todo.todo_item);
        });
        
        // Buttons state have to wait for todo list initialize, so we add function after retrieve data.

        // Listen to change event of checkbox, then switch to "DONE!" & "DELETE!" button state.
        $checkButtonState ();

        // Listen to click event then switch to "Confirm!" & "Cancel!" button state.
        $editTodo ();
      });
  }

  $retrieve ();
  
  $('.add-todo').click (function () {

    let newTodo = $('.new-todo').val ();

    console.log (newTodo);

    // axios.post ('http://localhost:3000/add', {})
    axios.post ('http://localhost:3000/add', {todo_item: newTodo})
      .then (res => {

        console.log (res.data);

        $retrieve ();

        $('.todo-title').val ('');
        $('.todo-desc').val ('');
        $('.submit-date').val ('');
        $('.new-todo').val ('');
      })
      .catch (err => {

        console.log (err);
        
        console.log (err.response);
      })
  });

  $('.delete-todo').click (function () {

    $('.checkbox').each (function (i) {
      
      if ($(this).is (':checked'))
        $todolist[i].checked = true;

      else {
        $todolist[i].checked = false;
      }
    });

    //? TODO: Refactoring to Closure

    let wantToDelete = {
      items: [],
      ids: [],
    };

    $todolist.forEach (todo => {

      if (todo.checked) {
        wantToDelete.items.push (todo.todo_item);
        wantToDelete.ids.push (todo.id);
      };

      return wantToDelete;
    });

    //? TODO: Remove comments

    // if (confirm (`Are you sure to delete \"${wantToDelete.items.join ('\", \"')}\"?`)) {

      let $destroyLoader = wantToDelete.ids.map (id => axios.post ('http://localhost:3000/remove', {id: id}));

      Promise.all ($destroyLoader)
        .then (() => $retrieve ());
    // }
  });

});