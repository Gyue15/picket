package edu.nju.gyue.picket.entity;

import javax.persistence.*;

@Entity
public class VenueMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long venueMessageId;

    private String titile;

    private String body;

    private Boolean needDisplay;

    @ManyToOne(cascade = {CascadeType.DETACH, CascadeType.MERGE, CascadeType.PERSIST, CascadeType.REFRESH})
    @JoinColumn(name = "venue_code")
    private Venue venue;

    public Long getVenueMessageId() {
        return venueMessageId;
    }

    public void setVenueMessageId(Long venueMessageId) {
        this.venueMessageId = venueMessageId;
    }

    public String getTitile() {
        return titile;
    }

    public void setTitile(String titile) {
        this.titile = titile;
    }

    public String getBody() {
        return body;
    }

    public void setBody(String body) {
        this.body = body;
    }

    public Boolean getNeedDisplay() {
        return needDisplay;
    }

    public void setNeedDisplay(Boolean needDisplay) {
        this.needDisplay = needDisplay;
    }

    public Venue getVenue() {
        return venue;
    }

    public void setVenue(Venue venue) {
        this.venue = venue;
    }
}
