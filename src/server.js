const cors = require('cors');
const app = require('express')().use(cors());
const http = require('http').Server(app);
const io = require('socket.io')(http);

class Server {
  /**
   * The constructor.
   * @param {integer} port The port to listen to if no default one is specified in ENV.
   * @param {Agent} agent The agent to interrogate.
   */
  constructor(port, agent) {
    this.port = port;

    app.get('/', (req, res) => {
      res.sendFile(`${__dirname}/index.html`);
    });

    io.on('connection', (socket) => {
      socket.on('number-of-issues-by-grouping', (filters) => {
        const {
          owner,
          repo,
          dataAgeValue,
          dataAgeUnit,
          dataAgeGrouping,
        } = filters;

        agent.getNumberOfIssuesByGrouping(
          owner,
          repo,
          dataAgeValue,
          dataAgeUnit,
          dataAgeGrouping,
          socket,
          'number-of-issues-by-grouping-results',
        )
          .catch((err) => {
            console.log(err);
          });
      });

      socket.on('number-of-issues-by-authors', (filters) => {
        const {
          owner,
          repo,
          dataAgeValue,
          dataAgeUnit,
        } = filters;

        agent.getNumberOfIssuesByAuthors(
          owner,
          repo,
          dataAgeValue,
          dataAgeUnit,
          socket,
          'number-of-issues-by-authors-results',
        )
          .then((data) => {
            // Save the data in the database
          }).catch((err) => {
            console.log(err);
          });
      });
    });
  }

  /**
   * Start the server.
   */
  start() {
    http.listen(this.port, () => {
      console.log(`Listening on *:${this.port}`);
    });
  }
}

module.exports = Server;
