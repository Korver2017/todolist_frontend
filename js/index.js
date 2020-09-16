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
        $($('.todo-list').find ('.form-control')[i]).attr ('value', todo.todo_id + ', ' + todo.todo_title + ', ' + todo.todo_desc);
      });
    });
  }

  $retrieve ();
  
  $('.create-button').click (function () {

    axios.post ('http://localhost:3000/add', {todo_title: 'SCSS', todo_desc: 'Learn SCSS', submission_date: '2020-09-14'})
      .then (res => {
        console.log (res.data);

        $retrieve ();
      })
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
      
      if ($(this).is (':checked')) {
        console.log (i);
        $todolist[i].checked = true;
      }

      else {
        $todolist[i].checked = false;
      }
    });

    console.log ($todolist);

    let $destroyLoader = $todolist.map (todo => {

        if (todo.checked) {

        axios.post ('http://localhost:3000/remove', {todo_id: todo.todo_id})
        .then (res => {

          console.log (res.data);

          $retrieve ();
        })
      }
    });

    Promise.all ($destroyLoader);
  });

});