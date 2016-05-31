#include "bag.h"
using namespace vision;
using namespace cv;
using namespace std;
Bag_Vision::Bag_Vision(string filename,vector<std::string> topics){
  bag.open(filename,rosbag::bagmode::Read);
  view = new rosbag::View(bag,rosbag::TopicQuery(topics));
}

size_t Bag_Vision::size(){return view->size();}

Bag_Vision::img_iterator::img_iterator(rosbag::View::iterator begin,rosbag::View::iterator end)
:curItr(begin), endItr(end){
}

Bag_Vision::img_iterator Bag_Vision::begin(){
  return img_iterator(view->begin(),view->end());
}

Bag_Vision::img_iterator Bag_Vision::end(){
  return img_iterator(view->end(),view->end());
}

Bag_Vision::img_iterator& Bag_Vision::img_iterator::operator++() {
          curItr++;
          return (*this);
}
Bag_Vision::img_iterator Bag_Vision::img_iterator::operator++(int) {
  Bag_Vision::img_iterator tmp(*this);
  operator++();
  operator++();
  return (tmp);
}

Mat Bag_Vision::img_iterator::operator*() {
  rosbag::MessageInstance m = *curItr;
  sensor_msgs::CompressedImage::ConstPtr c = m.instantiate<sensor_msgs::CompressedImage>();
  return imdecode(c->data,-1);
}
