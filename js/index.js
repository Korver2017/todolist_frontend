$(document).ready (function () {

  let $retrieve = () => {
    axios.get ('http://localhost:3000/')
    .then (res => {
      console.log (res.data);

      let data = res.data;
      
      let $inputGroup = 
        `<div class="input-group mt-3">
          <div class="input-group-prepend">
            <div class="input-group-text">
              <input type="checkbox" aria-label="Checkbox for following text input">
            </div>
          </div>
            <input value="" readonly type="text" class="form-control">
        </div>`

      console.log ($inputGroup);

      $('.todo-list').text (' ');

      data.forEach ((d, i) => {
        console.log (d);
        $('.todo-list').append ($inputGroup);
        // console.log ($($('.todo-list').find ('.form-control')[1]));
        $($('.todo-list').find ('.form-control')[i]).attr ('value', d.todo_id + ', ' + d.todo_title + ', ' + d.todo_desc);
      })

      // $('ul').append ('<li>K!</li>').append ('<li>K!</li>').append ('<li>K!</li>')
    })
  }

  $retrieve ();
  
  $('.create-button').click (function () {

    axios.post ('http://localhost:3000/add', {todo_title: 'PHP', todo_desc: 'Learn PHP', submission_date: '2020-09-14'})
      .then (res => {
        console.log (res.data);

        $retrieve ();
      })
  });

  $('.update-button').click (function () {

    axios.put('http://localhost:3000/update', {todo_id: 16, todo_title: 'CSS', todo_desc: 'Learn CSS', submission_date: '2020-09-16'})
      .then (res => {
        console.log (res.data);

        $retrieve ();
      })
  });

  $('.delete-button').click (function () {

    axios.post ('http://localhost:3000/remove', {todo_id: 14})
      .then (res => {
        console.log (res.data);

        $retrieve ();
      })
  });

});