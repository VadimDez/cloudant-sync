import PouchDB from "pouchdb";

import { CLOUDANT_URL, CREDENTIALS_URL } from "../constants";

export class DB {
  async init() {
    const token = await this.getToken();
    this.db = this.createDBConnection(token);
  }

  setOnChange(fn) {
    this.db.changes({ since: "now", live: true }).on("change", fn);
  }

  async getToken() {
    try {
      const response = await fetch(CREDENTIALS_URL);
      return await response.json();
    } catch (e) {
      console.error("Error at retrieving access token");
    }
  }

  createDBConnection(accessToken) {
    const remoteDB = new PouchDB(`${CLOUDANT_URL}/test`, {
      fetch: (url, opts) => {
        opts.headers.set("Authorization", `Bearer ${accessToken}`);
        opts.credentials = "include";
        return PouchDB.fetch(url, opts);
      }
    });

    const localDB = new PouchDB("test");

    PouchDB.sync(localDB, remoteDB, {
      live: true,
      heartbeat: false,
      timeout: false,
      retry: true
    });

    return localDB;
  }

  async getObjects() {
    return await this.db
      .allDocs({
        include_docs: true,
        descending: true
      })
      .then(doc => doc.rows.map(row => row.doc));
  }

  add(object) {
    this.db.post(object);
  }

  remove(object) {
    this.db.remove(object);
  }
}
