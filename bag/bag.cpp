#include "bag.h"
using namespace vision;
using namespace cv;

Bag_Vision::Bag_Vision(String filename,String topic){
  bag.open(filename,rosbag::bagmode::Read);
  std::vector<std::string> topics;
  topics.push_back(topic);
  view = new rosbag::View(bag,rosbag::TopicQuery(topics));
}

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

Mat Bag_Vision::img_iterator::operator*() {
  rosbag::MessageInstance m = *curItr;
  sensor_msgs::CompressedImage::ConstPtr c = m.instantiate<sensor_msgs::CompressedImage>();
  return imdecode(c->data,-1);
}
