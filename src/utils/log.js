export default function log(type, msg) {
  let color_1 = 'background: #8fbfef; color: #fff; border-radius: 3px 0 0 3px;';
  let color_2 = 'background: #606060; color: #a1e808; border-radius: 0 3px 3px 0;font-size:5px;font-weight: bold;padding:0 10px';
  let color_3 = 'background: #8fbfef; color: #FFF700; border-radius: 3px 0 0 3px;font-weight: bold';
  let color_4 = 'background: #606060; color: #FFCC00; border-radius: 0 3px 3px 0;font-size:5px;font-weight: bold;padding:0 10px';
  if (type == 'warning') return console.log(`%c warning:%c ${msg}!!`, color_3, color_4);
  if (type == 'success') return console.log(`%c message:%c ${msg}!!`, color_1, color_2);
}
