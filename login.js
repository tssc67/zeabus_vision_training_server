module.exports = function(req,res,next){
  if(!req.session.user){
    if(req.body.password == cfg.get('web.password')){
      req.session.user = 'zeabus';
      res.redirect('back');
    }
    else res.sendFile(__dirname + '/login.html');
  }
  else{
    next();
  }
};
