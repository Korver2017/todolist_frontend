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

  let $checkButtonState = () => {

    $('.checkbox').change (function () {
        
      let $checked = Array.from ($('.checkbox')).some (function (c) {
        return c.checked === true;
      });

      if ($checked) {
        $('.done-todo').attr ('disabled', false);
        $('.delete-todo').attr ('disabled', false);
      }

      else {
        $('.done-todo').attr ('disabled', true);
        $('.delete-todo').attr ('disabled', true);
      }
    });
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

        $checkButtonState ();
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

    //? Need to Refactoring to Closure

    let wantToDelete = {
      items: [],
      ids: [],
    };

    $todolist.forEach (todo => {

      if (todo.checked) {
        wantToDelete.items.push (todo.todo_item);
        wantToDelete.ids.push (todo.id);
      }
    });

    if (confirm (`Are you sure to delete \"${wantToDelete.items.join ('\", \"')}\"?`)) {

      let $destroyLoader = wantToDelete.ids.map (id => {
        return axios.post ('http://localhost:3000/remove', {id: id});
      });

      Promise.all ($destroyLoader)
        .then (() => $retrieve ());
    }
  });

});